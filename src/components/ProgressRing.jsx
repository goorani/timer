const R = 54
const C = 2 * Math.PI * R

// progress: 0 ~ 1 (채워진 비율)
export default function ProgressRing({ progress, label, done, warn }) {
  return (
    <div className={'ring' + (warn ? ' warn' : '')}>
      <svg viewBox="0 0 120 120">
        <defs>
          {/* 기본 필터 영역은 획 두께+번짐을 담지 못해 잘리므로 넉넉히 잡는다 */}
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow className="glow" dx="0" dy="0" stdDeviation="2.5" />
          </filter>
        </defs>
        <circle className="bg" cx="60" cy="60" r={R} />
        <circle
          className="fg"
          cx="60"
          cy="60"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          filter="url(#ring-glow)"
        />
      </svg>
      <div className={'time' + (done ? ' done' : '')}>{label}</div>
    </div>
  )
}
