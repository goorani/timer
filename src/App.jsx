import { useCallback, useEffect, useState } from 'react'
import Timer from './components/Timer.jsx'
import Stopwatch from './components/Stopwatch.jsx'
import Pet from './components/Pet.jsx'
import { usePet } from './pet.js'

export default function App() {
  const [mode, setMode] = useState('timer')
  const [running, setRunning] = useState(false)
  const [warn, setWarn] = useState(false)
  const [petEvent, setPetEvent] = useState(null)
  const { pet, addWorkout, addXp, rename } = usePet()

  // 타이머/스톱워치가 돌아가는 동안 실제 경과 시간만큼 캐릭터가 성장한다.
  // 백그라운드 탭에서 interval이 늦어져도 시각 차이로 계산하므로 손해가 없다.
  useEffect(() => {
    if (!running) return
    let last = Date.now()
    const flush = () => {
      const now = Date.now()
      addWorkout((now - last) / 1000)
      last = now
    }
    const id = setInterval(flush, 1000)
    return () => { clearInterval(id); flush() }
  }, [running, addWorkout])

  // 타이머를 끝까지 마치면 설정 시간의 20%를 보너스로 (최소 5)
  const onComplete = useCallback((totalSec) => {
    const bonus = Math.max(5, Math.round(totalSec * 0.2))
    addXp(bonus)
    setPetEvent({ type: 'complete', xp: bonus, id: Date.now() })
  }, [addXp])

  return (
    <div className="app">
      <h1 className="title">운동<span>타이머</span></h1>
      <div className="layout">
        <main className="main">
          <div className="tabs">
            <button className={mode === 'timer' ? 'on' : ''} onClick={() => setMode('timer')}>타이머</button>
            <button className={mode === 'watch' ? 'on' : ''} onClick={() => setMode('watch')}>스톱워치</button>
          </div>
          {mode === 'timer'
            ? <Timer onRunningChange={setRunning} onWarnChange={setWarn} onComplete={onComplete} />
            : <Stopwatch onRunningChange={setRunning} />}
          <div className="hint">스페이스: 시작/일시정지 · R: 초기화</div>
        </main>
        <Pet pet={pet} onRename={rename} running={running} warn={warn} event={petEvent} />
      </div>
    </div>
  )
}
