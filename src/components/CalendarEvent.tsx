type EventType = {
  id: string
  type: 'match' | 'training'
  date: string
  title: string
  status: string
  opponent?: string
  location?: string
}

interface CalendarEventProps {
  event: EventType
  onClick?: () => void
  isCompact?: boolean
}

export function CalendarEvent({ event, onClick, isCompact = false }: CalendarEventProps) {
  const isMatch = event.type === 'match'
  const isCompleted = event.status === 'completed'
  
  if (isCompact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left px-1 py-0.5 rounded text-xs font-medium truncate flex items-center gap-1 ${
          isMatch 
            ? 'bg-green-600/20 text-green-300 border border-green-600/30' 
            : 'bg-purple-600/20 text-purple-300 border border-purple-600/30'
        } ${isCompleted ? 'opacity-50' : ''}`}
        title={event.title}
      >
        <span>{isMatch ? '🏐' : '💪'}</span>
        <span className="truncate">{event.title}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-2 rounded-lg border text-left transition-all ${
        isMatch 
          ? `bg-green-900/30 border-green-600/50 hover:bg-green-900/50 ${isCompleted ? 'opacity-60' : ''}` 
          : `bg-purple-900/30 border-purple-600/50 hover:bg-purple-900/50 ${isCompleted ? 'opacity-60' : ''}`
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{isMatch ? '🏐' : '💪'}</span>
        <span className="font-semibold text-gray-100 truncate">{event.title}</span>
      </div>
      {event.opponent && (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span className="text-gray-500">vs</span>
          {event.opponent}
        </div>
      )}
      {event.location && (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          📍 {event.location}
        </div>
      )}
      {event.status === 'in_progress' && (
        <div className="mt-1 text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded inline-block">
          Em andamento
        </div>
      )}
      {event.status === 'completed' && (
        <div className="mt-1 text-xs bg-green-600/30 text-green-300 px-2 py-0.5 rounded inline-block">
          Finalizado
        </div>
      )}
    </button>
  )
}