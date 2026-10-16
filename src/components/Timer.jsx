import { useEffect, useState } from 'react'
import ProgressRing from './ProgressRing.jsx'
import { beep, formatTime, useHotkeys, useNow } from '../utils.js'

const EXERCISES = [
  { name: '플랭크', icon: '🧱', sec: 60 },
  { name: '스쿼트 홀드', icon: '🦵', sec: 120 },
  { name: '월싯', icon: '🪑', sec: 180 },
  { name: '버피', icon: '🔥', sec: 180 },
  { name: '줄넘기', icon: '🤸', sec: 300 },
  { name: '스트레칭', icon: '🧘', sec: 600 },
]

const DEFAULT_FIELDS = { h: 0, m: 1, s: 0 }
const WARN_MS = 10000 // 마지막 10초는 경고 색상

const toMs = ({ h, m, s }) => ((+h || 0) * 3600 + (+m || 0) * 60 + (+s || 0)) * 1000
const toFields = (sec) => ({ h: Math.floor(sec / 3600), m: Math.floor(sec / 60) % 60, s: sec % 60 })
const durationLabel = (sec) => (sec >= 60 ? `${sec / 60}분` : `${sec}초`)

export default function Timer() {
  const [fields, setFields] = useState(DEFAULT_FIELDS)
  const [exercise, setExercise] = useState(null)     // 선택한 운동 이름 (직접 설정이면 null)
  const [total, setTotal] = useState(toMs(DEFAULT_FIELDS))
  const [remaining, setRemaining] = useState(toMs(DEFAULT_FIELDS))
  const [endAt, setEndAt] = useState(null)           // 실행 중이면 종료 시각
  const [done, setDone] = useState(false)

  const running = endAt !== null
  const now = useNow(running)
  const left = running ? Math.max(0, endAt - now) : remaining

  // 시간이 다 되면 종료 처리
  useEffect(() => {
    if (running && left <= 0) {
      setEndAt(null)
      setRemaining(0)
      setDone(true)
      beep()
    }
  }, [running, left])

  useEffect(() => {
    document.title = done
      ? '💪 완료!'
      : running ? `${formatTime(Math.ceil(left / 1000) * 1000)} · 운동타이머` : '운동타이머'
  }, [done, running, left])

  useEffect(() => () => { document.title = '운동타이머' }, [])

  const applyFields = (next, name = null) => {
    setFields(next)
    setExercise(name)
    const ms = toMs(next)
    setTotal(ms)
    setRemaining(ms)
    setEndAt(null)
    setDone(false)
  }

  const toggle = () => {
    if (running) {
      setRemaining(endAt - Date.now())
      setEndAt(null)
      return
    }
    let base = remaining
    if (base <= 0) {
      base = toMs(fields)
      setTotal(base)
    }
    if (base <= 0) return
    setDone(false)
    setEndAt(Date.now() + base)
  }

  const reset = () => applyFields(fields, exercise)

  // 운동 버튼: 시간 설정 후 바로 시작
  const startExercise = (ex) => {
    applyFields(toFields(ex.sec), ex.name)
    setEndAt(Date.now() + ex.sec * 1000)
  }

  useHotkeys(toggle, reset)

  const onField = (key) => (e) => {
    const max = key === 'h' ? 99 : 59
    const v = Math.min(max, Math.max(0, parseInt(e.target.value) || 0))
    applyFields({ ...fields, [key]: e.target.value === '' ? '' : v })
  }

  const startLabel = running ? '일시정지' : remaining > 0 && remaining < total ? '계속' : '시작'
  const warn = running && left <= WARN_MS

  return (
    <>
      <div className="exercise-name">
        {done ? '완료! 수고했어요 💪' : exercise ?? '직접 설정'}
      </div>

      <ProgressRing
        progress={total ? left / total : 0}
        label={formatTime(Math.ceil(left / 1000) * 1000)}
        done={done}
        warn={warn}
      />

      <div className="controls">
        <button className="primary" onClick={toggle}>{startLabel}</button>
        <button onClick={reset}>초기화</button>
      </div>

      <h2 className="section-title">운동 선택</h2>
      <div className="exercises">
        {EXERCISES.map((ex) => (
          <button
            key={ex.name}
            className={exercise === ex.name ? 'on' : ''}
            onClick={() => startExercise(ex)}
          >
            <span className="ex-icon">{ex.icon}</span>
            <span className="ex-name">{ex.name}</span>
            <span className="ex-time">{durationLabel(ex.sec)}</span>
          </button>
        ))}
      </div>

      <h2 className="section-title">직접 설정</h2>
      <div className="inputs">
        {[['h', '시'], ['m', '분'], ['s', '초']].map(([key, label]) => (
          <label key={key}>
            <input type="number" min="0" value={fields[key]} onChange={onField(key)} disabled={running} />
            {label}
          </label>
        ))}
      </div>
    </>
  )
}
