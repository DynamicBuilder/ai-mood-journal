export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      </div>
      <p className="text-gray-400 text-sm animate-pulse-subtle tracking-wide">
        Analyzing your mood...
      </p>
    </div>
  )
}
