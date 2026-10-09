export default function ForgettingCurve({ className = "", markers = ["LEARN", "R1", "R2", "R3", "R4", "MASTERED"] }) {
  const points = [
    [10, 30], [70, 108], [110, 40], [175, 118], [220, 55],
    [280, 122], [330, 65], [390, 124], [445, 72], [500, 20],
  ];
  const path = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `C ${p[0] - 25} ${points[i - 1][1]}, ${p[0] - 15} ${p[1]}, ${p[0]} ${p[1]}`))
    .join(" ");

  const dots = [points[0], points[2], points[4], points[6], points[8], points[9]];

  return (
    <svg viewBox="0 0 510 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="codCurveFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF9100" stopOpacity="1" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="codCurveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9100" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF9100" stopOpacity="0" />
        </linearGradient>
        <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF9100" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Grid crosshair guide lines */}
      <line x1="10" y1="70" x2="500" y2="70" stroke="#263342" strokeDasharray="3 3" strokeWidth="1" />
      <line x1="250" y1="10" x2="250" y2="135" stroke="#263342" strokeDasharray="3 3" strokeWidth="1" />

      <path d={`${path} L 500 140 L 10 140 Z`} fill="url(#codCurveFill)" stroke="none" />
      <path
        d={path}
        stroke="url(#codCurveFade)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1000"
        filter="url(#radarGlow)"
        className="animate-drawLine"
      />
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="4.5"
            fill="#06080A"
            stroke={i === dots.length - 1 ? "#00F0FF" : "#FF9100"}
            strokeWidth="2.5"
          />
          {markers[i] && (
            <text
              x={x}
              y={y - 12}
              textAnchor="middle"
              fontSize="9"
              fill={i === dots.length - 1 ? "#00F0FF" : "#FFB300"}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="bold"
            >
              {markers[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
