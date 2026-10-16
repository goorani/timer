import { useEffect, useRef, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export function formatTime(ms, withCentis = false) {
  const t = Math.max(0, ms)
  const h = Math.floor(t / 3600000)
  const m = Math.floor(t / 60000) % 60
  const s = Math.floor(t / 1000) % 60
  let out = (h ? pad(h) + ':' : '') + pad(m) + ':' + pad(s)
  if (withCentis) out += '.' + pad(Math.floor(t / 10) % 100)
  return out
}

// active일 때 현재 시각(ms)을 주기적으로 갱신해 리렌더링을 일으킨다.
// requestAnimationFrame은 백그라운드 탭에서 멈추므로 setInterval을 쓴다
// (백그라운드에서는 브라우저가 약 1초 간격으로 늦추지만 알람은 울린다).
export function useNow(active) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 30)
    return () => clearInterval(id)
  }, [active])
  return now
}

// 스페이스/R 단축키 (입력창 포커스 중에는 무시)
export function useHotkeys(onToggle, onReset) {
  const handlers = useRef({ onToggle, onReset })
  handlers.current = { onToggle, onReset }
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.code === 'Space') {
        e.preventDefault()
        handlers.current.onToggle()
      } else if (e.key === 'r' || e.key === 'R') {
        handlers.current.onReset()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
}

export function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = 880
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.25, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3)
      o.start(ctx.currentTime + t)
      o.stop(ctx.currentTime + t + 0.3)
    })
  } catch {
    // 오디오를 쓸 수 없는 환경이면 무시
  }
}
