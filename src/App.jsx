import { useState } from 'react'
import MoodInput from './components/MoodInput.jsx'
import ResultCard from './components/ResultCard.jsx'
import MoodTimeline from './components/MoodTimeline.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import { useMoodEntries } from './hooks/useMoodEntries.js'

export default function App() {
  const [currentEntry, setCurrentEntry] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { entries, addEntry } = useMoodEntries()

  async function handleAnalyze(text) {
    setIsLoading(true)
    setError(null)
    setCurrentEntry(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-mood`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ entry_text: text }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`)
      }

      setCurrentEntry(data)
      addEntry(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto w-full" style={{ maxWidth: '680px' }}>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            AI Mood Journal
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">
            Understand your emotions with AI
          </p>
        </header>

        {/* Mood input */}
        <section className="mb-6" aria-label="Journal entry form">
          <MoodInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </section>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading spinner or result card */}
        <section className="mb-6" aria-label="Analysis result" aria-live="polite">
          {isLoading ? (
            <div className="w-full bg-surface rounded-2xl border border-white/5">
              <LoadingSpinner />
            </div>
          ) : (
            currentEntry && <ResultCard entry={currentEntry} />
          )}
        </section>

        {/* Mood timeline chart */}
        <section aria-label="Mood history">
          <MoodTimeline entries={entries} />
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-xs text-gray-700">
            Your thoughts are private and analyzed securely
          </p>
        </footer>
      </div>
    </div>
  )
}
