export function CalendarFilters({ 
  filter, 
  onFilterChange 
}: { 
  filter: 'all' | 'matches' | 'trainings'
  onFilterChange: (filter: 'all' | 'matches' | 'trainings') => void 
}) {
  const filters = [
    { value: 'all' as const, label: 'Todos', icon: '📅' },
    { value: 'matches' as const, label: 'Partidas', icon: '🏐' },
    { value: 'trainings' as const, label: 'Treinos', icon: '💪' },
  ]

  return (
    <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            filter === f.value
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>{f.icon}</span>
          <span className="text-sm font-medium">{f.label}</span>
        </button>
      ))}
    </div>
  )
}