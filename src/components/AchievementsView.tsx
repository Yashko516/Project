import { Award, Trophy, Flame, Target } from 'lucide-react'
import { AchievementBadge } from './AchievementBadge'

interface Player {
  number: number
  name: string
  position: string
  status: string
}

interface Action {
  playerNumber: number
  type: string
  result: string
}

interface Match {
  actions?: Action[]
}

interface Props {
  players: Player[]
  matches: Match[]
}

export function AchievementsView({ players, matches }: Props) {
  // Calculate achievements for players
  const calculatePlayerAchievements = () => {
    const achievements: any[] = []

    players.forEach(player => {
      // Calculate totals
      let attackPoints = 0, blockPoints = 0, aces = 0, perfectSets = 0
      let attackTotal = 0, blockTotal = 0, serveTotal = 0, setTotal = 0
      let receptionPerfect = 0, receptionTotal = 0
      let defenseSuccess = 0, defenseTotal = 0

      matches.forEach(match => {
        match.actions?.forEach(action => {
          if (action.playerNumber === player.number) {
            if (action.type === 'attack') {
              attackTotal++
              if (action.result === 'ponto') attackPoints++
            } else if (action.type === 'block') {
              blockTotal++
              if (action.result === 'ponto') blockPoints++
            } else if (action.type === 'serve') {
              serveTotal++
              if (action.result === 'ace') aces++
            } else if (action.type === 'set') {
              setTotal++
              if (action.result === 'perfeito') perfectSets++
            } else if (action.type === 'reception') {
              receptionTotal++
              if (action.result === 'perfeita') receptionPerfect++
            } else if (action.type === 'defense') {
              defenseTotal++
              if (action.result === 'sucesso') defenseSuccess++
            }
          }
        })
      })

      // Add achievements
      achievements.push({
        id: `${player.number}-attack-points`,
        playerId: player.number,
        playerName: player.name,
        name: 'Atacante Poderoso',
        description: '99 pontos de ataque',
        icon: 'flame' as const,
        color: 'purple',
        unlocked: attackPoints >= 99,
        progress: attackPoints,
        target: 99
      })

      achievements.push({
        id: `${player.number}-block-master`,
        playerId: player.number,
        playerName: player.name,
        name: 'Mestre do Bloqueio',
        description: '50 bloqueios',
        icon: 'medal' as const,
        color: 'blue',
        unlocked: blockPoints >= 50,
        progress: blockPoints,
        target: 50
      })

      achievements.push({
        id: `${player.number}-ace-master`,
        playerId: player.number,
        playerName: player.name,
        name: 'Rei do Saque',
        description: '25 aces',
        icon: 'lightning' as const,
        color: 'yellow',
        unlocked: aces >= 25,
        progress: aces,
        target: 25
      })

      const receptionExcellence = receptionTotal > 0 ? (receptionPerfect / receptionTotal) * 100 : 0

      achievements.push({
        id: `${player.number}-reception-star`,
        playerId: player.number,
        playerName: player.name,
        name: 'Estrela da Recepção',
        description: '80%+ excelência em recepção',
        icon: 'star' as const,
        color: 'green',
        unlocked: receptionExcellence >= 80,
        progress: receptionExcellence,
        target: 80
      })

      achievements.push({
        id: `${player.number}-defense-master`,
        playerId: player.number,
        playerName: player.name,
        name: 'Guerreiro Defensivo',
        description: '100 defesas',
        icon: 'medal' as const,
        color: 'orange',
        unlocked: defenseSuccess >= 100,
        progress: defenseSuccess,
        target: 100
      })

      achievements.push({
        id: `${player.number}-set-ace`,
        playerId: player.number,
        playerName: player.name,
        name: 'Piloto do Levantamento',
        description: '500 levantamentos',
        icon: 'trophy' as const,
        color: 'cyan',
        unlocked: setTotal >= 500,
        progress: setTotal,
        target: 500
      })

      const attackEfficiency = attackTotal > 0 ? (attackPoints / attackTotal) * 100 : 0

      achievements.push({
        id: `${player.number}-efficiency-master`,
        playerId: player.number,
        playerName: player.name,
        name: 'Eficiência Máxima',
        description: '70%+ eficiência em ataque',
        icon: 'award' as const,
        color: 'purple',
        unlocked: attackEfficiency >= 70,
        progress: attackEfficiency,
        target: 70
      })
    })

    return achievements
  }

  const achievements = calculatePlayerAchievements()
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  // Group by player
  const achievementsByPlayer = new Map<string, any[]>()
  achievements.forEach(a => {
    if (!achievementsByPlayer.has(a.playerId)) {
      achievementsByPlayer.set(a.playerId, [])
    }
    achievementsByPlayer.get(a.playerId)!.push(a)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500/30 rounded-xl">
              <Award className="w-12 h-12 text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Conquistas</h2>
              <p className="text-zinc-400">
                {unlockedCount} de {totalCount} conquistas desbloqueadas
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-400 mb-1">Progresso Geral</div>
            <div className="text-3xl font-bold text-purple-400">{progressPercent.toFixed(0)}%</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4 w-full">
          <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white">{unlockedCount}</div>
              <div className="text-sm text-zinc-400">Conquistadas</div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-zinc-400" />
            <div>
              <div className="text-2xl font-bold text-white">{totalCount - unlockedCount}</div>
              <div className="text-sm text-zinc-400">Pendentes</div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">{players.length}</div>
              <div className="text-sm text-zinc-400">Jogadores</div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{matches.length}</div>
              <div className="text-sm text-zinc-400">Partidas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements by Player */}
      {Array.from(achievementsByPlayer.entries()).map(([playerId, playerAchievements]) => {
        const player = players.find(p => p.number === playerId)
        const playerUnlocked = playerAchievements.filter(a => a.unlocked).length
        
        return (
          <div key={playerId} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-400">#{playerId}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{player?.name || 'Jogador'}</h3>
                  <p className="text-sm text-zinc-400">{playerUnlocked} de {playerAchievements.length} conquistas</p>
                </div>
              </div>
              <div className="w-32">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progresso</span>
                  {playerAchievements.length > 0 && (
                    <span>{((playerUnlocked / playerAchievements.length) * 100).toFixed(0)}%</span>
                  )}
                </div>
                {playerAchievements.length > 0 && (
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                      style={{ width: `${(playerUnlocked / playerAchievements.length) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerAchievements.map(achievement => (
                <AchievementBadge
                  key={achievement.id}
                  id={achievement.id}
                  name={achievement.name}
                  description={achievement.description}
                  icon={achievement.icon}
                  color={achievement.color}
                  unlocked={achievement.unlocked}
                  progress={achievement.progress}
                  target={achievement.target}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AchievementsView