import { useState } from 'react'
import Timer from './components/Timer.jsx'
import Stopwatch from './components/Stopwatch.jsx'

export default function App() {
  const [mode, setMode] = useState('timer')

  return (
    <div className="app">
      <h1 className="title">운동<span>타이머</span></h1>
      <div className="tabs">
        <button className={mode === 'timer' ? 'on' : ''} onClick={() => setMode('timer')}>타이머</button>
        <button className={mode === 'watch' ? 'on' : ''} onClick={() => setMode('watch')}>스톱워치</button>
      </div>
      {mode === 'timer' ? <Timer /> : <Stopwatch />}
      <div className="hint">스페이스: 시작/일시정지 · R: 초기화</div>
    </div>
  )
}
