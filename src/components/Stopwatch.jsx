import { useState } from 'react'
import ProgressRing from './ProgressRing.jsx'
import { formatTime, useHotkeys, useNow } from '../utils.js'

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)     // 일시정지 시점까지 누적된 시간
  const [startedAt, setStartedAt] = useState(null)
  const [laps, setLaps] = useState([])          // 누적 시간 목록 (최신이 앞)

  const running = startedAt !== null
  const now = useNow(running)
  const current = running ? elapsed + now - startedAt : elapsed

  const toggle = () => {
    if (running) {
      setElapsed(elapsed + Date.now() - startedAt)
      setStartedAt(null)
    } else {
      setStartedAt(Date.now())
    }
  }

  const lapOrReset = () => {
    if (running) {
      setLaps([elapsed + Date.now() - startedAt, ...laps])
    } else {
      setElapsed(0)
      setLaps([])
    }
  }

  useHotkeys(toggle, () => { if (!running) lapOrReset() })

  return (
    <>
      <div className="exercise-name">기록 측정</div>
      <ProgressRing progress={(current % 60000) / 60000} label={formatTime(current, true)} />

      <div className="controls">
        <button className="primary" onClick={toggle}>
          {running ? '일시정지' : elapsed ? '계속' : '시작'}
        </button>
        <button onClick={lapOrReset}>{running ? '랩' : '초기화'}</button>
      </div>

      {laps.length > 0 && (
        <ul className="laps">
          {laps.map((t, i) => {
            const prev = laps[i + 1] ?? 0
            return (
              <li key={laps.length - i}>
                <span>랩 {laps.length - i} · +{formatTime(t - prev, true)}</span>
                <span>{formatTime(t, true)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
