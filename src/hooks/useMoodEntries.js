import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useMoodEntries() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEntries() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('mood_entries')
          .select('id, created_at, mood_score, mood_label, reflection, entry_text')
          .order('created_at', { ascending: false })
          .limit(7)

        if (fetchError) {
          throw fetchError
        }

        // Reverse so oldest entry is first (left side of chart)
        const reversed = (data || []).slice().reverse()
        setEntries(reversed)
      } catch (err) {
        setError(err.message || 'Failed to load mood entries')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [])

  function addEntry(newEntry) {
    setEntries((prev) => {
      const updated = [...prev, newEntry]
      // Keep only the last 7
      return updated.slice(-7)
    })
  }

  return { entries, isLoading, error, addEntry }
}
