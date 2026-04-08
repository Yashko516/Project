import { useState, useEffect } from 'react'
import { X, Save, Star, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react'

interface Player {
  id: string
  name: string
  number: number
  position: string
}

interface TeamStats {
  matchId: string
  playerId: string
  attackPoints: number
  attackErrors: number
  blockPoints: number
  blockErrors: number
  serveAces: number
  serveErrors: number
  defenseSuccess: number
  defenseErrors: number
  receptionPerfect: number
  receptionGood: number
  receptionErrors: number
  setPerfect: number
  setRegular: number
  setErrors: number
  cardsYellow: number
  cardsRed: number
}

interface PostGameNote {
  playerId: string
  playerName: string
  playerNumber: number
  matchId: string
  overallRating: number // 1-5 estrelas
  positiveNotes: string
  improvementNotes: string
  coachFeedback: string
  strengths: string[]
  weaknesses: string[]
  matchDate: string
}

interface PostGameNotesFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: PostGameNote) => void
  players: Player[]
  matchId: string
  matchDate: string
  teamStats: TeamStats[]
  existingNotes?: PostGameNote
}

export default function PostGameNotesForm({
  isOpen,
  onClose,
  onSave,
  players,
  matchId,
  matchDate,
  teamStats,
  existingNotes
}: PostGameNotesFormProps) {
  const [playerId, setPlayerId] = useState('')
  const [overallRating, setOverallRating] = useState(3)
  const [positiveNotes, setPositiveNotes] = useState('')
  const [improvementNotes, setImprovementNotes] = useState('')
  const [coachFeedback, setCoachFeedback] = useState('')
  const [strength, setStrength] = useState('')
  const [weakness, setWeakness] = useState('')
  const [strengths, setStrengths] = useState<string[]>([])
  const [weaknesses, setWeaknesses] = useState<string[]>([])

  // Carregar nota existente se estiver editando
  useEffect(() => {
    if (existingNotes) {
      setPlayerId(existingNotes.playerId)
      setOverallRating(existingNotes.overallRating)
      setPositiveNotes(existingNotes.positiveNotes)
      setImprovementNotes(existingNotes.improvementNotes)
      setCoachFeedback(existingNotes.coachFeedback)
      setStrengths(existingNotes.strengths || [])
      setWeaknesses(existingNotes.weaknesses || [])
    }
  }, [existingNotes])

  // Selecionar primeiro jogador automaticamente
  useEffect(() => {
    if (!playerId && players.length > 0 && !existingNotes) {
      setPlayerId(players[0].id)
    }
  }, [players, playerId, existingNotes])

  const handleAddStrength = () => {
    if (strength.trim()) {
      setStrengths([...strengths, strength.trim()])
      setStrength('')
    }
  }

  const handleRemoveStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index))
  }

  const handleAddWeakness = () => {
    if (weakness.trim()) {
      setWeaknesses([...weaknesses, weakness.trim()])
      setWeakness('')
    }
  }

  const handleRemoveWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!playerId) {
      alert('Por favor, selecione um jogador')
      return
    }

    const player = players.find(p => p.id === playerId)
    if (!player) return

    const note: PostGameNote = {
      playerId,
      playerName: player.name,
      playerNumber: player.number,
      matchId,
      overallRating,
      positiveNotes,
      improvementNotes,
      coachFeedback,
      strengths,
      weaknesses,
      matchDate
    }

    onSave(note)
    onClose()
    
    // Reset form
    setPlayerId('')
    setOverallRating(3)
    setPositiveNotes('')
    setImprovementNotes('')
    setCoachFeedback('')
    setStrengths([])
    setWeaknesses([])
  }

  const selectedPlayer = players.find(p => p.id === playerId)
  const playerStats = teamStats.filter(s => s.playerId === playerId)

  // Calcular eficiências para sugestão automática
  const attackEfficiency = playerStats.length > 0 
    ? ((playerStats[0].attackPoints / (playerStats[0].attackPoints + playerStats[0].attackErrors || 1)) * 100).toFixed(0)
    : 0

  const receptionEfficiency = playerStats.length > 0 
    ? ((playerStats[0].receptionPerfect / (playerStats[0].receptionPerfect + playerStats[0].receptionGood + playerStats[0].receptionErrors || 1)) * 100).toFixed(0)
    : 0

  const setEfficiency = playerStats.length > 0 
    ? ((playerStats[0].setPerfect / (playerStats[0].setPerfect + playerStats[0].setRegular + playerStats[0].setErrors || 1)) * 100).toFixed(0)
    : 0

  if (!isOpen) return null

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
              <p className="text-gray-400 mt-1">Feedback individual para jogadores</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selecionar Jogador */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Jogador
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            >
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  #{player.number} - {player.name} ({player.position})
                </option>
              ))}
            </select>
          </div>

          {/* Avaliação Geral - Estrelas */}
          {selectedPlayer && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Avaliação Geral - {selectedPlayer.name}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className={`text-3xl transition-all ${
                      star <= overallRating
                        ? 'text-yellow-500 scale-110'
                        : 'text-gray-600 hover:text-yellow-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-3 text-gray-400 text-sm">
                  {overallRating}/5 estrelas
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {overallRating === 5 && '⭐ Excelente - Performance excepcional!'}
                {overallRating === 4 && '👍 Ótimo - Muito bom jogador'}
                {overallRating === 3 && '✓ Bom - Performance consistente'}
                {overallRating === 2 && '⚠️ Regular - Precisa melhorar'}
                {overallRating === 1 && '❌ Insuficiente - Requer atenção'}
              </div>
            </div>
          )}

          {/* Estatísticas Resumidas (Sugestão automática) */}
          {selectedPlayer && playerStats.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Estatísticas do Jogador nesta Partida
              </label>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Ataque</div>
                  <div className="text-white font-bold">{attackEfficiency}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Recepção</div>
                  <div className="text-white font-bold">{receptionEfficiency}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Levantamento</div>
                  <div className="text-white font-bold">{setEfficiency}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Pontos Fortes */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Pontos Fortes
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStrength()}
                placeholder="Ex: Saque potente, Bloqueio preciso..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                onClick={handleAddStrength}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Adicionar
              </button>
            </div>
            {strengths.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {strengths.map((str, index) => (
                  <span
                    key={index}
                    className="bg-green-900/50 border border-green-600 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {str}
                    <button
                      onClick={() => handleRemoveStrength(index)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pontos a Melhorar */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Pontos a Melhorar
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={weakness}
                onChange={(e) => setWeakness(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWeakness()}
                placeholder="Ex: Comunicação, Velocidade..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                onClick={handleAddWeakness}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Adicionar
              </button>
            </div>
            {weaknesses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weak, index) => (
                  <span
                    key={index}
                    className="bg-red-900/50 border border-red-600 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {weak}
                    <button
                      onClick={() => handleRemoveWeakness(index)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notas Positivas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-green-500">
              📌 Notas Positivas (Feedback construtivo)
            </label>
            <textarea
              value={positiveNotes}
              onChange={(e) => setPositiveNotes(e.target.value)}
              rows={4}
              placeholder="Descreva o que o jogador fez bem na partida..."
              className="w-full bg-gray-800 border border-green-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {/* Notas de Melhoria */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-orange-500">
              🎯 Pontos para Melhorar (Sugestões de treino)
            </label>
            <textarea
              value={improvementNotes}
              onChange={(e) => setImprovementNotes(e.target.value)}
              rows={4}
              placeholder="Sugira o que o jogador pode trabalhar para melhorar..."
              className="w-full bg-gray-800 border border-orange-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Feedback do Técnico */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-purple-500">
              👨‍🏫 Feedback do Técnico (Mensagem pessoal)
            </label>
            <textarea
              value={coachFeedback}
              onChange={(e) => setCoachFeedback(e.target.value)}
              rows={3}
              placeholder="Mensagem direta ao jogador..."
              className="w-full bg-gray-800 border border-purple-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Notas
          </button>
        </div>
      </div>
    </div>
  )
}