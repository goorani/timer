// 직접 그린 오리지널 캐릭터 (오른쪽을 바라보는 방향이 기본)
const INK = '#0e0f11'
const STROKE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }

function Eyes({ cx = 66, cy = 70, gap = 18, size = 7 }) {
  return (
    <g>
      {[cx - gap / 2, cx + gap / 2].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={cy} rx={size * 0.8} ry={size} fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx={x + 2} cy={cy + 1} r={size * 0.5} fill={INK} />
          <circle cx={x + 3} cy={cy - 2} r={size * 0.18} fill="#fff" />
        </g>
      ))}
      <ellipse cx={cx - gap / 2 - 6} cy={cy + 10} rx="5" ry="3" fill="#ff8fa3" opacity=".7" />
      <ellipse cx={cx + gap / 2 + 6} cy={cy + 10} rx="5" ry="3" fill="#ff8fa3" opacity=".7" />
    </g>
  )
}

function Egg({ cracked }) {
  return (
    <g>
      <ellipse cx="60" cy="70" rx="30" ry="38" fill="#f4f1e1" {...STROKE} />
      <circle cx="48" cy="56" r="6" fill="#c6ff00" />
      <circle cx="70" cy="80" r="8" fill="#c6ff00" />
      <circle cx="68" cy="50" r="4" fill="#c6ff00" />
      <circle cx="47" cy="86" r="4" fill="#c6ff00" />
      {cracked && (
        <polyline points="38,66 46,60 52,68 60,61 67,69 74,62 82,67" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      )}
    </g>
  )
}

function Baby() {
  return (
    <g>
      <ellipse cx="46" cy="104" rx="9" ry="5" fill="#8fd43a" {...STROKE} />
      <ellipse cx="74" cy="104" rx="9" ry="5" fill="#8fd43a" {...STROKE} />
      <path d="M60 34 Q63 22 72 24 Q66 28 64 36" fill="#8fd43a" {...STROKE} />
      <circle cx="60" cy="72" r="32" fill="#b8f35a" {...STROKE} />
      <ellipse cx="62" cy="86" rx="18" ry="12" fill="#e4ffb0" />
      <Eyes cx={66} cy={66} />
      <path d="M62 80 Q66 84 70 80" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

function Teen() {
  return (
    <g>
      <path d="M26 86 Q8 80 12 62 Q18 74 30 76" fill="#7fd13a" {...STROKE} />
      <polygon points="38,40 34,14 54,32" fill="#7fd13a" {...STROKE} />
      <polygon points="80,38 92,14 94,42" fill="#7fd13a" {...STROKE} />
      <ellipse cx="44" cy="106" rx="11" ry="6" fill="#6cbf2c" {...STROKE} />
      <ellipse cx="78" cy="106" rx="11" ry="6" fill="#6cbf2c" {...STROKE} />
      <ellipse cx="62" cy="70" rx="36" ry="36" fill="#9be84a" {...STROKE} />
      <ellipse cx="64" cy="86" rx="20" ry="14" fill="#dcffa6" />
      <rect x="28" y="44" width="70" height="9" rx="4" fill="#ff3b30" {...STROKE} />
      <path d="M30 48 L18 42 M30 50 L18 56" stroke="#ff3b30" strokeWidth="5" strokeLinecap="round" />
      <Eyes cx={68} cy={66} gap={20} />
      <path d="M62 80 Q68 87 74 80" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="98" cy="82" rx="8" ry="7" fill="#9be84a" {...STROKE} />
    </g>
  )
}

function Final() {
  return (
    <g>
      <path d="M22 88 Q2 84 6 62 L14 70 L12 56 Q22 74 30 78" fill="#5fc42a" {...STROKE} />
      <polygon points="36,40 24,6 42,22 44,8 56,32" fill="#ffd60a" {...STROKE} />
      <polygon points="80,36 88,4 94,22 104,12 96,42" fill="#ffd60a" {...STROKE} />
      <ellipse cx="42" cy="108" rx="12" ry="6" fill="#4fae20" {...STROKE} />
      <ellipse cx="80" cy="108" rx="12" ry="6" fill="#4fae20" {...STROKE} />
      <ellipse cx="62" cy="70" rx="40" ry="38" fill="#7fdc3a" {...STROKE} />
      <ellipse cx="64" cy="92" rx="22" ry="13" fill="#d2ff98" />
      <polygon points="64,88 67,94 73,94 68,98 70,104 64,100 58,104 60,98 55,94 61,94" fill="#ffd60a" stroke={INK} strokeWidth="1.5" />
      <rect x="24" y="42" width="78" height="10" rx="5" fill="#ff3b30" {...STROKE} />
      <path d="M26 46 L12 38 M26 48 L12 56" stroke="#ff3b30" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 58 L60 62 M76 62 L86 58" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <Eyes cx={68} cy={68} gap={22} />
      <path d="M60 80 Q68 88 76 80 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* 알통 팔 */}
      <path d="M98 74 Q112 72 112 58 Q118 52 114 46" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M98 74 Q112 72 112 58 Q118 52 114 46" fill="none" stroke="#7fdc3a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="108" cy="62" r="7" fill="#7fdc3a" {...STROKE} />
    </g>
  )
}

export default function PetSprite({ stage, level }) {
  return (
    <svg viewBox="0 0 120 120" className="pet-svg" aria-hidden="true">
      <ellipse cx="60" cy="114" rx="30" ry="4" fill="#000" opacity=".35" className="pet-shadow" />
      <g className="pet-figure">
        {stage === 0 && <Egg cracked={level >= 2} />}
        {stage === 1 && <Baby />}
        {stage === 2 && <Teen />}
        {stage === 3 && <Final />}
      </g>
      <g className="pet-sweat">
        <path d="M96 30 Q100 38 96 42 Q92 38 96 30 Z" fill="#5ac8fa" stroke={INK} strokeWidth="1.5" />
        <path d="M24 34 Q27 40 24 43 Q21 40 24 34 Z" fill="#5ac8fa" stroke={INK} strokeWidth="1.5" />
      </g>
    </svg>
  )
}
