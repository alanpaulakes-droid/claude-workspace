export default function ProgressBar({ percent, color = '#6366f1' }) {
  const value = Math.max(0, Math.min(100, percent || 0))
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="progress-fill"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  )
}
