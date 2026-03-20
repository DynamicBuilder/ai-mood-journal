import { useState } from 'react'
import AnalyzeButton from './AnalyzeButton.jsx'

export default function MoodInput({ onAnalyze, isLoading }) {
  const [text, setText] = useState('')
  const charCount = text.length
  const maxChars = 1000

  function handleSubmit() {
    if (text.trim() && !isLoading) {
      onAnalyze(text.trim())
    }
  }

  function handleKeyDown(e) {
    // Cmd+Enter or Ctrl+Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="w-full bg-surface rounded-2xl p-5 shadow-lg border border-white/5">
      <label htmlFor="mood-entry" className="block text-sm font-medium text-gray-400 mb-3">
        What&apos;s on your mind?
      </label>
      <textarea
        id="mood-entry"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder="How are you feeling today? Describe your mood, thoughts, or emotions..."
        rows={5}
        className={[
          'w-full bg-surface2 text-gray-100 placeholder-gray-600',
          'rounded-xl px-4 py-3 text-sm leading-relaxed',
          'border border-white/5 resize-y',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'min-h-[150px]',
        ].join(' ')}
        style={{ minHeight: '150px' }}
        aria-label="Journal entry"
      />
      <div className="flex items-center justify-between mt-2 mb-4">
        <p className="text-xs text-gray-600">
          Press{' '}
          <kbd className="px-1 py-0.5 bg-surface2 rounded text-gray-500 font-mono text-xs">
            Ctrl+Enter
          </kbd>{' '}
          to analyze
        </p>
        <span
          className={[
            'text-xs tabular-nums transition-colors',
            charCount > maxChars * 0.9 ? 'text-yellow-500' : 'text-gray-600',
          ].join(' ')}
        >
          {charCount}/{maxChars}
        </span>
      </div>
      <AnalyzeButton
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={text.trim().length === 0}
      />
    </div>
  )
}
