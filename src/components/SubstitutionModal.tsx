import React, { useState, useEffect } from 'react'
import { X, Users, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react'

interface Player {
  id: string
  number: number
  name: string
  position: string
  isStarter: boolean
  substitutes: string[]
  onCourt?: boolean
}

interface SubstitutionModalProps {
  players: Player[]
  currentSet: number
  onClose: () => void
  onConfirm: (playerOut: Player, playerIn: Player) => void
  substitutionsInSet: number
  maxSubstitutions: number
}

interface Player {
  id: string
  number: number
  name: string
  position: string
  status?: string
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  players,
  currentSet,
  onClose,
  onConfirm,
  substitutionsInSet,
  maxSubstitutions
}) => {
  const [playerOut, setPlayerOut] = useState<Player | null>(null)
  const [playerIn, setPlayerIn] = useState<Player | null>(null)
  const [error, setError] = useState('')

  // Simular jogadores na quadra e bancos
  const onCourtPlayers = players.filter(p => p.isStarter || p.status === 'starter')
  const benchPlayers = players.filter(p => !p.isStarter && p.status !== 'starter')

  const handleConfirm = () => {
    if (!playerOut || !playerIn) {
      setError('Selecione ambos os jogadores')
      return
    }

    if (playerOut.id === playerIn.id) {
      setError('Jogadores devem ser diferentes')
      return
    }

    if (substitutionsInSet >= maxSubstitutions) {
      setError(`Limite de ${maxSubstitutions} substituições por set atingido`)
      return
    }

    onConfirm(playerOut, playerIn)
    onClose()
  }

  const getPlayerIcon = (position: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Levantador': '👋',
      'Ponteiro': '⚡',
      'Central': '🏗',
      'Oposto': '🎯',
      'Libero': '🛡️'
    }
    return icons[position] || '👤'
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-600/30 shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-gray-900 p-4 border-b border-purple-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Completações da equipe</h2>
              <p className="text-sm text-gray-300">Set {currentSet}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Contador de substituições */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Levantamentos do set</span>
              </div>
              <span className={`text-2xl font-bold ${
                substitutionsInSet >= maxSubstitutions ? 'text-red-400' : 'text-green-400'
              }`}>
                {substitutionsInSet}/{maxSubstitutions}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  substitutionsInSet >= maxSubstitutions ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-green-500'
                }`}
                style={{ width: `${(substitutionsInSet / maxSubstitutions) * 100}%` }}
              />
            </div>
            {substitutionsInSet >= maxSubstitutions && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Limite de substituições atingido!</span>
              </div>
            )}
          </div>

          {/* Seleção de jogador saindo */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Jogador Saindo (Na Quadra)
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {onCourtPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setPlayerOut(player)}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    playerOut?.id === player.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{getPlayerIcon(player.position)}</div>
                  <div className="text-white font-bold">#{player.number}</div>
                  <div className="text-xs text-gray-400 truncate">{player.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de jogador entrando */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Jogador Entrando (Banco)
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {benchPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setPlayerIn(player)}
                  disabled={playerOut?.id === player.id}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    playerIn?.id === player.id
                      ? 'border-green-500 bg-green-500/20'
                      : playerOut?.id === player.id
                      ? 'border-gray-700/50 bg-gray-800/50 opacity-50 cursor-not-allowed'
                      : 'border-gray-700 bg-gray-800 hover:border-green-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{getPlayerIcon(player.position)}</div>
                  <div className="text-white font-bold">#{player.number}</div>
                  <div className="text-xs text-gray-400 truncate">{player.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview da substituição */}
          {playerOut && playerIn && (
            <div className="bg-gradient-to-r from-purple-900/20 to-green-900/20 rounded-xl p-4 border border-purple-600/30">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 border-2 border-red-500">
                    <span className="text-2xl font-bold text-red-400">#</span>
                  </div>
                  <div className="text-white font-bold">{playerOut.number}</div>
                  <div className="text-sm text-gray-400">{playerOut.name}</div>
                </div>
                <RotateCcw className="w-8 h-8 text-purple-400 animate-pulse" />
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 border-2 border-green-500">
                    <span className="text-2xl font-bold text-green-400">#</span>
                  </div>
                  <div className="text-white font-bold">{playerIn.number}</div>
                  <div className="text-sm text-gray-400">{playerIn.name}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!playerOut || !playerIn || substitutionsInSet >= maxSubstitutions}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Substituição
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}