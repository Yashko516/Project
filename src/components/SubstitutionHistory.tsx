import React from 'react'
import { RotateCcw, Clock } from 'lucide-react'

interface Player {
  id: string
  number: number
  name: string
  position: string
  isStarter?: boolean
  substitutes?: string[]
  onCourt?: boolean
}

interface Substitution {
  substitutingOut: Player
  substitutingIn: Player
  setNumber: number
  timestamp: string
}

interface SubstitutionHistoryProps {
  substitutions: Substitution[]
  onRemove?: (index: number) => void
}

export const SubstitutionHistory: React.FC<SubstitutionHistoryProps> = ({
  substitutions,
  onRemove
}) => {
  if (substitutions.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma substituição neste set</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {substitutions.map((sub, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition"
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="text-center">
              <span className="text-xs text-gray-400">#{sub.substitutingOut.number}</span>
            </div>
            <RotateCcw className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <div className="text-center">
              <span className="text-xs text-gray-400">#{sub.substitutingIn.number}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Set {sub.setNumber}</span>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-300 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}