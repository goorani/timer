import { useEffect, useRef, useState } from 'react'
import PetSprite from './PetSprite.jsx'
import { STAGES, levelFromXp, nextEvolutionLevel, stageFromLevel, xpToReach } from '../pet.js'

const fmtMinutes = (sec) => {
  const m = Math.floor(sec / 60)
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`
}

// pet: { name, xp }, running/warn: 운동 상태, event: { type: 'complete', xp, id }
export default function Pet({ pet, onRename, running, warn, event }) {
  const level = levelFromXp(pet.xp)
  const stage = stageFromLevel(level)
  const [flash, setFlash] = useState(null) // { text, kind } 잠깐 띄우는 말풍선

  // 레벨 업 / 진화 감지
  const prevLevel = useRef(level)
  useEffect(() => {
    if (level > prevLevel.current) {
      const evolved = stageFromLevel(level) > stageFromLevel(prevLevel.current)
      setFlash(evolved
        ? { text: `와! ${STAGES[stageFromLevel(level)].name}(으)로 진화했다!`, kind: 'evolve' }
        : { text: `레벨 업! Lv.${level}`, kind: 'level' })
    }
    prevLevel.current = level
  }, [level])

  // 타이머 완료 보너스 (같은 순간 레벨 업/진화가 일어났다면 그 메시지를 우선)
  useEffect(() => {
    if (event?.type !== 'complete') return
    setFlash((f) => (f && f.kind !== 'complete' ? f : { text: `+${event.xp} XP 보너스! 최고야!`, kind: 'complete' }))
  }, [event])

  useEffect(() => {
    if (!flash) return
    const id = setTimeout(() => setFlash(null), 3500)
    return () => clearTimeout(id)
  }, [flash])

  const line = flash?.text
    ?? (warn ? '조금만 더! 힘내!' : running ? (stage === 0 ? '두근두근…' : '영차! 영차!') : STAGES[stage].line)

  const state = flash ? 'celebrate' : running ? 'active' : 'idle'

  const cur = xpToReach(level)
  const next = xpToReach(level + 1)
  const pct = Math.min(100, ((pet.xp - cur) / (next - cur)) * 100)
  const evoLevel = nextEvolutionLevel(stage)

  return (
    <aside className="pet-card">
      <div className="pet-head">
        <input
          className="pet-name"
          value={pet.name}
          maxLength={10}
          onChange={(e) => onRename(e.target.value)}
          aria-label="캐릭터 이름"
        />
        <span className="pet-level">Lv.{level}</span>
      </div>
      <div className="pet-species">{STAGES[stage].name}</div>

      <div className={`pet-stage pet-${state} stage-${stage}` + (flash?.kind === 'evolve' ? ' evolving' : '')}>
        <div className={'bubble' + (flash ? ' pop' : '')} key={line}>{line}</div>
        <div className="pet-walker">
          <div className="pet-body">
            <PetSprite stage={stage} level={level} />
          </div>
        </div>
      </div>

      <div className="xp-row">
        <span>EXP</span>
        <span>다음 레벨까지 {fmtMinutes(Math.max(0, next - pet.xp) + 59)}</span>
      </div>
      <div className="xp-bar"><div style={{ width: `${pct}%` }} /></div>

      <div className="pet-stats">
        <div><b>{fmtMinutes(pet.workoutSec)}</b><span>함께 운동</span></div>
        <div><b>{evoLevel ? `Lv.${evoLevel}` : 'MAX'}</b><span>{evoLevel ? '다음 진화' : '최종 진화'}</span></div>
      </div>
    </aside>
  )
}
