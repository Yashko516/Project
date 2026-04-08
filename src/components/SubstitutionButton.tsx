import React from 'react'
import { RotateCcw } from 'lucide-react'

interface SubstitutionButtonProps {
  onClick: () => void
  substitutionsCount: number
  maxSubstitutions: number
  disabled?: boolean
}

export const SubstitutionButton: React.FC<SubstitutionButtonProps> = ({
  onClick,
  substitutionsCount,
  maxSubstitutions,
  disabled = false
}) => {
  const isFull = substitutionsCount >= maxSubstitutions

  return (
    <button
      onClick={onClick}
      disabled={disabled || isFull}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
        ${disabled || isFull
          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40'
        }
      `}
    >
      <RotateCcw className="w-5 h-5" />
      <span>Substituição</span>
      {!isFull && (
        <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">
          {substitutionsCount}/{maxSubstitutions}
        </span>
      )}
    </button>
  )
}