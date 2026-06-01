const logos = [
  { label: 'Apex Digital',    bg: 'linear-gradient(135deg,#3B9EFF,#1a7de0)', letter: 'A' },
  { label: 'NovaBridge',      bg: 'linear-gradient(135deg,#9D6FFF,#7c3aed)', letter: 'N' },
  { label: 'ClearPath Co.',   bg: 'linear-gradient(135deg,#34d399,#059669)', letter: 'C' },
  { label: 'Momentum Labs',   bg: 'linear-gradient(135deg,#f59e0b,#d97706)', letter: 'M' },
  { label: 'Praxis Group',    bg: 'linear-gradient(135deg,#f87171,#dc2626)', letter: 'P' },
  { label: 'Vantage AI',      bg: 'linear-gradient(135deg,#60a5fa,#3B9EFF)', letter: 'V' },
  { label: 'Scaleway Inc.',   bg: 'linear-gradient(135deg,#a78bfa,#9D6FFF)', letter: 'S' },
  { label: 'Orion Works',     bg: 'linear-gradient(135deg,#34d399,#3B9EFF)', letter: 'O' },
]

function Tile({ label, bg, letter }) {
  return (
    <div className="logo-tile">
      <span className="lm" style={{ background: bg }}>{letter}</span>
      {label}
    </div>
  )
}

export default function Clients() {
  return (
    <div className="logos-section">
      <p className="label">Trusted by teams at</p>
      <div className="marquee-wrap">
        <div className="marquee">
          {logos.map(l => <Tile key={l.label} {...l} />)}
          {logos.map(l => <Tile key={l.label + '-dup'} {...l} />)}
        </div>
      </div>
    </div>
  )
}
