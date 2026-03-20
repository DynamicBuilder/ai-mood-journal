export default function AnalyzeButton({ onClick, isLoading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      className={[
        'w-full py-3 px-6 rounded-xl font-semibold text-white text-sm tracking-wide',
        'transition-all duration-200 ease-in-out',
        'bg-gradient-to-r from-violet-600 to-indigo-600',
        'hover:from-violet-500 hover:to-indigo-500',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-surface',
        'active:scale-[0.98]',
        (isLoading || disabled)
          ? 'opacity-50 cursor-not-allowed hover:from-violet-600 hover:to-indigo-600'
          : 'cursor-pointer hover:shadow-lg hover:shadow-violet-500/20',
      ].join(' ')}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            style={{ animation: 'spin 0.8s linear infinite' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Analyzing...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          Analyze My Mood
        </span>
      )}
    </button>
  )
}
