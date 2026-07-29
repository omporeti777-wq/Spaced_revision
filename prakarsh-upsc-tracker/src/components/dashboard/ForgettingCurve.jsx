// The app's signature element: a stylised "forgetting curve" — memory
// decays after learning, then each revision jolts it back up higher
// and flattens the decay, exactly the mechanic this app automates.
// Used on the dashboard hero and the statistics page.
export default function ForgettingCurve({ className = "", markers = ["Learn", "R1", "R2", "R3", "R4", "R5"] }) {
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
        <linearGradient id="curveFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4A657" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4FA89B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A657" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#D4A657" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 500 140 L 10 140 Z`} fill="url(#curveFill)" stroke="none" />
      <path
        d={path}
        stroke="url(#curveFade)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1000"
        className="animate-drawLine"
      />
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#0F1417" stroke={i === dots.length - 1 ? "#4FA89B" : "#D4A657"} strokeWidth="2.5" />
          {markers[i] && (
            <text x={x} y={y - 14} textAnchor="middle" fontSize="10" fill="#8B9296" fontFamily="Inter, sans-serif">
              {markers[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
