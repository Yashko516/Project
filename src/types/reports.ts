export interface ReportOptions {
  includeCharts: boolean
  includeStats: boolean
  includePhotos: boolean
  format: 'A4' | 'Letter'
  orientation: 'portrait' | 'landscape'
}

export interface MatchReportData {
  matchName: string
  opponent: string
  date: string
  location: string
  sets: { team: number; opponent: number }[]
  finalScore: { team: number; opponent: number }
  teamStats: {
    attacks: { total: number; points: number; errors: number }
    blocks: { total: number; points: number; errors: number }
    serves: { total: number; aces: number; errors: number; success: number }
    defenses: { total: number; success: number; errors: number }
    receptions: { total: number; perfect: number; good: number; errors: number }
    sets: { total: number; perfect: number; regular: number; bad: number }
    cards: { yellow: number; red: number }
    timeouts: number
    substitutions: number
  }
  playersStats: Array<{
    number: number
    name: string
    position: string
    attacks: number
    blocks: number
    serves: number
    defenses: number
    receptions: number
    sets: number
    aces: number
    errors: number
  }>
  topPlayers: {
    bestAttacker: { number: number; name: string; points: number }
    bestBlocker: { number: number; name: string; blocks: number }
    bestServer: { number: number; name: string; aces: number }
    bestReceiver: { number: number; name: string; receptions: number }
    bestSetter: { number: number; name: string; sets: number }
  }
}

export interface PlayerReportData {
  player: {
    number: number
    name: string
    position: string
    height: string
    age: number
    status: 'titular' | 'reserva'
  }
  matches: number
  totalStats: {
    attacks: { total: number; points: number; errors: number; efficiency: number }
    blocks: { total: number; points: number; errors: number; efficiency: number }
    serves: { total: number; aces: number; errors: number; success: number; aceRate: number }
    defenses: { total: number; success: number; errors: number; efficiency: number }
    receptions: { total: number; perfect: number; good: number; errors: number; efficiency: number }
    sets: { total: number; perfect: number; regular: number; bad: number; quality: number }
    cards: { yellow: number; red: number }
  }
  matchPerformance: Array<{
    opponent: string
    date: string
    attacks: number
    blocks: number
    serves: number
    aces: number
    defenses: number
    receptions: number
    sets: number
  }>
}

export interface TeamReportData {
  teamName: string
  coach: string
  category: string
  season: string
  overview: {
    totalMatches: number
    wins: number
    losses: number
    winRate: number
    totalSetsWon: number
    totalSetsLost: number
  }
  teamStats: {
    attacks: { total: number; points: number; efficiency: string }
    blocks: { total: number; points: number; efficiency: string }
    serves: { total: number; aces: number; aceRate: string }
    defenses: { total: number; success: number; efficiency: string }
    receptions: { total: number; perfect: number; efficiency: string }
    sets: { total: number; perfect: number; quality: string }
  }
  playersRanking: Array<{
    number: number
    name: string
    position: string
    attacks: number
    blocks: number
    aces: number
    receptions: number
    sets: number
    totalPoints: number
  }>
  matchesSummary: Array<{
    opponent: string
    date: string
    score: string
    result: 'win' | 'loss'
    teamPoints: number
    opponentPoints: number
  }>
}