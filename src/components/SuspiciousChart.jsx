/**
 * SuspiciousChart — lightweight bar chart, no external lib.
 * Accepts an array of numeric values and renders animated bars.
 */
export default function SuspiciousChart({ data, label, color, unit = '' }) {
  const max = Math.max(...data, 1)

  return (
    <div>
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
      <div className="flex items-end gap-0.5 h-16">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-300"
            style={{
              height: `${(v / max) * 100}%`,
              minHeight: '2px',
              background: color,
              opacity: 0.55 + (i / data.length) * 0.45,
            }}
            title={`${v}${unit}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>-{data.length * 2.5}s</span>
        <span>now</span>
      </div>
    </div>
  )
}
