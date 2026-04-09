import { Target, TrendingUp, Award, Flame } from 'lucide-react'

interface PerformanceGoal {
  metric: string
  label: string
  current: number
  target: number
  unit: string
}

interface Props {
  goals: PerformanceGoal[]
  title?: string
  showOverall?: boolean
}

export function GoalsDashboard({ goals, title = "Objetivos de Desempenho", showOverall = false }: Props) {
  const calculateOverall = () => {
    if (goals.length === 0) return 0
    const totalPercent = goals.reduce((sum, goal) => sum + (goal.current / goal.target) * 100, 0)
    return Math.min(totalPercent / goals.length, 100)
  }

  const overall = calculateOverall()
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'from-green-500 to-green-400'
    if (percent >= 75) return 'from-purple-500 to-purple-400'
    if (percent >= 50) return 'from-yellow-500 to-yellow-400'
    return 'from-red-500 to-red-400'
  }

  const getMetricLabel = (metric: string) => {
    const labels: { [key: string]: { emoji: string, color: string } } = {
      'attackEfficiency': { emoji: '⚡', color: 'purple' },
      'blockEfficiency': { emoji: '🛡️', color: 'blue' },
      'serveAceRate': { emoji: '🎾', color: 'yellow' },
      'receptionExcellence': { emoji: '🤲', color: 'green' },
      'defenseEfficiency': { emoji: '👐', color: 'pink' },
      'setQuality': { emoji: '💨', color: 'cyan' }
    }
    return labels[metric] || { emoji: '📊', color: 'gray' }
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Target className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        {showOverall && (
          <div className="text-right">
            <div className="text-sm text-zinc-400">Progresso Geral</div>
            <div className="text-2xl font-bold text-white">{overall.toFixed(1)}%</div>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      {showOverall && goals.length > 0 && (
        <div className="mb-6">
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor(overall)} transition-all duration-700`}
              style={{ width: `${overall}%` }}
            >
              {overall >= 100 && (
                <div className="flex items-center justify-center h-full">
                  <Award className="w-4 h-4 text-white ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal, index) => {
          const percent = Math.min((goal.current / goal.target) * 100, 100)
          const info = getMetricLabel(goal.metric)
          const isAchieved = goal.current >= goal.target

          return (
            <div
              key={index}
              className={`
                bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 transition-all duration-300
                ${isAchieved ? 'shadow-lg shadow-green-500/20 ring-1 ring-green-500/50' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{info.emoji}</span>
                  <h4 className="font-semibold text-white">{goal.label}</h4>
                </div>
                {isAchieved && (
                  <div className="flex items-center gap-1 text-green-400">
                    <Award className="w-5 h-5" />
                    <span className="text-lg">🎯</span>
                  </div>
                )}
              </div>

              {/* Current vs Target */}
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-sm text-zinc-400">Atual</div>
                  <div className={`text-2xl font-bold ${isAchieved ? 'text-green-400' : 'text-white'}`}>
                    {goal.current.toFixed(1)}{goal.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">Meta</div>
                  <div className="text-xl font-semibold text-zinc-300">
                    {goal.target.toFixed(1)}{goal.unit}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progresso</span>
                  <span>{percent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(percent)} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              {isAchieved && (
                <div className="mt-3 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
                  <span className="text-green-400 font-bold text-sm flex items-center gap-1 justify-center">
                    <Flame className="w-4 h-4" />
                    Meta Atingida!
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Motivational Message */}
      {goals.length > 0 && showOverall && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-zinc-400 font-medium">Mensagem Motivacional</p>
              <p className="text-white">
                {overall >= 100 ? "🎉 Excelente! Você atingiu todas as metas!" :
                 overall >= 75 ? "👏 Muito bom! Continue assim, está quase lá!" :
                 overall >= 50 ? "💪 Está progredindo! Mantenha o foco!" :
                 "🔥 Não desista! Cada melhoria conta!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalsDashboard