import { Trophy, Medal, Star, Flame, Zap, Award } from 'lucide-react'

interface AchievementBadgeProps {
  id: string
  name: string
  description: string
  icon: 'trophy' | 'medal' | 'star' | 'flame' | 'lightning' | 'award'
  color: string
  unlocked: boolean
  progress: number
  target: number
}

export function AchievementBadge({
  name,
  description,
  icon,
  color,
  unlocked,
  progress,
  target
}: AchievementBadgeProps) {
  const getIcon = () => {
    switch (icon) {
      case 'trophy': return Trophy
      case 'medal': return Medal
      case 'star': return Star
      case 'flame': return Flame
      case 'lightning': return Zap
      case 'award': return Award
      default: return Star
    }
  }

  const Icon = getIcon()
  const progressPercent = Math.min((progress / target) * 100, 100)

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${unlocked 
          ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'bg-zinc-900/50 border-zinc-700 opacity-60'}
      `}
    >
      {/* Badge Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`
            p-3 rounded-lg ${unlocked ? 'bg-purple-500' : 'bg-zinc-800'}
          `}
        >
          <Icon className={`w-8 h-8 ${unlocked ? 'text-white' : 'text-zinc-500'}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${unlocked ? 'text-white' : 'text-zinc-400'}`}>
            {name}
          </h3>
        </div>
        {unlocked && (
          <span className="text-2xl">🏆</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-3">{description}</p>

      {/* Progress Bar */}
      {!unlocked && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Progresso</span>
            <span>{progress} / {target} ({progressPercent.toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {unlocked && (
        <div className="mt-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
          <span className="text-green-400 font-bold text-sm flex items-center gap-1 justify-center">
            <Award className="w-4 h-4" />
            Conquistado!
          </span>
        </div>
      )}
    </div>
  )
}