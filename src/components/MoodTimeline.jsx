import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { getMoodColor } from '../utils/moodColors.js'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
)

function formatLabel(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function MoodTimeline({ entries }) {
  const hasEntries = entries && entries.length > 0

  const labels = hasEntries ? entries.map((e) => formatLabel(e.created_at)) : []
  const scores = hasEntries ? entries.map((e) => e.mood_score) : []
  const pointColors = hasEntries ? entries.map((e) => getMoodColor(e.mood_score)) : []

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood Score',
        data: scores,
        borderColor: 'rgba(139, 92, 246, 0.6)',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2a2a2a',
        titleColor: '#e5e7eb',
        bodyColor: '#9ca3af',
        borderColor: '#444',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items) => {
            if (!items.length) return ''
            const idx = items[0].dataIndex
            const entry = entries[idx]
            return formatLabel(entry?.created_at) || items[0].label
          },
          label: (item) => {
            const idx = item.dataIndex
            const entry = entries[idx]
            const label = entry?.mood_label ? ` ${entry.mood_label}` : ''
            return `Score: ${item.raw}/10${label}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#333333',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        border: {
          color: '#333333',
        },
      },
      y: {
        min: 0,
        max: 10,
        grid: {
          color: '#333333',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          callback: (value) => (Number.isInteger(value) ? value : ''),
        },
        border: {
          color: '#333333',
        },
      },
    },
    animation: {
      duration: 600,
      easing: 'easeInOutQuart',
    },
  }

  return (
    <div
      className="w-full rounded-2xl border border-white/5 shadow-lg overflow-hidden"
      style={{ backgroundColor: '#2a2a2a' }}
      role="region"
      aria-label="Mood timeline chart"
    >
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-base font-semibold text-gray-100">Your Mood Journey</h2>
        <p className="text-xs text-gray-500 mt-0.5">Last 7 entries</p>
      </div>

      <div className="px-4 pb-6 pt-2">
        {hasEntries ? (
          <Line data={chartData} options={chartOptions} aria-label="Line chart showing mood scores over time" />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No entries yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Start journaling to see your mood over time
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
