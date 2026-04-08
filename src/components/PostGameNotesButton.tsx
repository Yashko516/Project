import { MessageSquare, FileText, Plus } from 'lucide-react'

export default function PostGameNotesButton({
  onClick,
  hasNotes = false,
  compact = false
}: {
  onClick: () => void
  hasNotes?: boolean
  compact?: boolean
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
        title={hasNotes ? "Ver notas de pós-partida" : "Adicionar notas de pós-partida"}
      >
        <MessageSquare className="w-4 h-4" />
        {hasNotes && <span className="w-2 h-2 bg-green-500 rounded-full" />}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
        hasNotes
          ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30'
          : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30'
      }`}
      title={hasNotes ? "Ver notas de pós-partida" : "Adicionar notas de pós-partida"}
    >
      {hasNotes ? (
        <FileText className="w-5 h-5" />
      ) : (
        <Plus className="w-5 h-5" />
      )}
      <span>{hasNotes ? 'Notas' : 'Notas'}</span>
      {hasNotes && <span className="w-2 h-2 bg-green-500 rounded-full" />}
    </button>
  )
}