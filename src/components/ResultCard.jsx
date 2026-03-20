import { getMoodColor, getMoodBgColor } from '../utils/moodColors.js'

function formatDateTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function ResultCard({ entry }) {
  if (!entry) return null

  const { mood_score, mood_label, reflection, created_at } = entry
  const color = getMoodColor(mood_score)
  const bgColor = getMoodBgColor(mood_score)

  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-xl border border-white/5 animate-fade-in-up"
      style={{ backgroundColor: '#2a2a2a' }}
      role="region"
      aria-label="Mood analysis result"
    >
      {/* Colored left border accent */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />

      <div className="p-6">
        {/* Score and label */}
        <div
          className="flex flex-col items-center justify-center py-6 rounded-xl mb-6"
          style={{ backgroundColor: bgColor }}
        >
          <span
            className="text-7xl font-bold tabular-nums leading-none mb-2 transition-colors"
            style={{ color }}
            aria-label={`Mood score: ${mood_score} out of 10`}
          >
            {mood_score}
          </span>
          <span
            className="text-2xl font-semibold capitalize tracking-wide"
            style={{ color }}
          >
            {mood_label}
          </span>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i < mood_score ? color : '#444',
                  opacity: i < mood_score ? 1 : 0.4,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-5" />

        {/* Reflection */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            AI Reflection
          </p>
          <p className="text-gray-300 text-sm leading-relaxed italic">
            &ldquo;{reflection}&rdquo;
          </p>
        </div>

        {/* Timestamp */}
        {created_at && (
          <p className="text-xs text-gray-600 text-right">
            Analyzed on {formatDateTime(created_at)}
          </p>
        )}
      </div>
    </div>
  )
}
