export const getMoodColor = (score) => {
  if (score >= 7) return '#22c55e'  // green
  if (score >= 4) return '#eab308'  // yellow
  return '#ef4444'                   // red
}

export const getMoodBgColor = (score) => {
  if (score >= 7) return 'rgba(34, 197, 94, 0.1)'
  if (score >= 4) return 'rgba(234, 179, 8, 0.1)'
  return 'rgba(239, 68, 68, 0.1)'
}
