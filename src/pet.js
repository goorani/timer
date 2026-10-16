import { useCallback, useEffect, useState } from 'react'

// 경험치(xp) = 실제로 운동한 초 + 타이머 완료 보너스.
// 레벨 L → L+1 에 필요한 xp는 120 * L (2분, 4분, 6분 ...)
// 따라서 레벨 n에 도달하는 누적 xp = 60 * n * (n - 1)
export const xpToReach = (level) => 60 * level * (level - 1)
export const levelFromXp = (xp) => Math.floor((1 + Math.sqrt(1 + Math.max(0, xp) / 15)) / 2)

export const STAGES = [
  { minLevel: 1, name: '알', line: '따뜻하게 품어주세요…' },
  { minLevel: 3, name: '꼬물몽', line: '같이 운동하자!' },
  { minLevel: 6, name: '근육몽', line: '오늘도 불태우자!' },
  { minLevel: 10, name: '파워몽', line: '우린 최강 콤비야!' },
]

export const stageFromLevel = (level) => {
  let i = 0
  STAGES.forEach((s, idx) => { if (level >= s.minLevel) i = idx })
  return i
}

export const nextEvolutionLevel = (stage) => STAGES[stage + 1]?.minLevel ?? null

const KEY = 'workout-pet'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved && typeof saved.xp === 'number') return { name: '몽이', workoutSec: 0, ...saved }
  } catch {
    // 저장소를 못 쓰는 환경이면 새로 시작
  }
  return { name: '몽이', xp: 0, workoutSec: 0 }
}

export function usePet() {
  const [pet, setPet] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(pet))
    } catch {
      // 저장 실패는 무시 (다음 방문 때 처음부터)
    }
  }, [pet])

  // 운동한 시간(초)만큼 경험치와 누적 운동 시간을 함께 올린다
  const addWorkout = useCallback((sec) => {
    if (sec > 0) setPet((p) => ({ ...p, xp: p.xp + sec, workoutSec: p.workoutSec + sec }))
  }, [])

  // 보너스 경험치 (운동 시간에는 포함하지 않음)
  const addXp = useCallback((amount) => {
    if (amount > 0) setPet((p) => ({ ...p, xp: p.xp + amount }))
  }, [])

  const rename = useCallback((name) => setPet((p) => ({ ...p, name })), [])

  return { pet, addWorkout, addXp, rename }
}
