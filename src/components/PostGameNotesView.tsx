import { X, Star, MessageSquare, Lightbulb, TrendingUp, Edit2, Calendar, Trophy, Target } from 'lucide-react'

interface PostGameNote {
  playerId: string
  playerName: string
  playerNumber: number
  matchId: string
  matchDate: string
  opponentName?: string
  overallRating: number
  positiveNotes: string
  improvementNotes: string
  coachFeedback: string
  strengths: string[]
  weaknesses: string[]
}

interface PostGameNotesViewProps {
  isOpen: boolean
  onClose: () => void
  note: PostGameNote | null
  onEdit?: (note: PostGameNote) => void
}

export default function PostGameNotesView({
  isOpen,
  onClose,
  note,
  onEdit
}: PostGameNotesViewProps) {
  if (!isOpen || !note) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border-2 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                Notas de Pós-Partida
              </h2>
              <p className="text-gray-400 mt-1">
                #{note.playerNumber} - {note.playerName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(note)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Match Info */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(note.matchDate).toLocaleDateString('pt-BR')}</span>
              </div>
              {note.opponentName && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Trophy className="w-4 h-4" />
                    <span>vs {note.opponentName}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Avaliação Geral */}
          <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Avaliação Geral
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= note.overallRating
                          ? 'text-yellow-500'
                          : 'text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-3 text-white font-bold text-lg">
                    {note.overallRating}/5
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">Nível de Performance</div>
                <div className={`text-lg font-bold ${
                  note.overallRating >= 4 ? 'text-green-400' :
                  note.overallRating === 3 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {note.overallRating === 5 && 'Excelente ⭐'}
                  {note.overallRating === 4 && 'Ótimo 👍'}
                  {note.overallRating === 3 && 'Bom ✓'}
                  {note.overallRating === 2 && 'Regular ⚠️'}
                  {note.overallRating === 1 && 'Insuficiente ❌'}
                </div>
              </div>
            </div>
          </div>

          {/* Pontos Fortes */}
          {note.strengths && note.strengths.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Pontos Fortes
              </label>
              <div className="flex flex-wrap gap-2">
                {note.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="bg-green-900/50 border border-green-600 text-green-300 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pontos a Melhorar */}
          {note.weaknesses && note.weaknesses.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Pontos a Melhorar
              </label>
              <div className="flex flex-wrap gap-2">
                {note.weaknesses.map((weakness, index) => (
                  <span
                    key={index}
                    className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notas Positivas */}
          {note.positiveNotes && (
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
              <label className="block text-sm font-medium text-green-400 mb-3">
                📌 Notas Positivas
              </label>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {note.positiveNotes}
              </p>
            </div>
          )}

          {/* Notas de Melhoria */}
          {note.improvementNotes && (
            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-600/30">
              <label className="block text-sm font-medium text-orange-400 mb-3">
                🎯 Pontos para Melhorar
              </label>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {note.improvementNotes}
              </p>
            </div>
          )}

          {/* Feedback do Técnico */}
          {note.coachFeedback && (
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/30">
              <label className="block text-sm font-medium text-purple-400 mb-3">
                👨‍🏫 Feedback do Técnico
              </label>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed italic">
                "{note.coachFeedback}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}