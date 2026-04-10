import { useState, useEffect } from 'react'
import { 
  User, Shield, Mail, Lock, Eye, EyeOff, Menu, X, 
  Trophy, Activity, Dumbbell, BarChart3, Settings, 
  Trash2, LogOut, Plus, Play, Pause, 
  ChevronLeft, ChevronRight, Download, Calendar, Users,
  GitCompare, History
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { CourtMap } from './components/CourtMap'
import { CourtZoneSelector } from './components/CourtZoneSelector'
import { ExportPDFButton } from './components/ExportPDFButton'
import PostGameNotesForm from './components/PostGameNotesForm'
import PostGameNotesView from './components/PostGameNotesView'
import PostGameNotesButton from './components/PostGameNotesButton'
import { SubstitutionModal } from './components/SubstitutionModal'
import { SubstitutionButton } from './components/SubstitutionButton'
import SubstitutionHistory from './components/SubstitutionHistory'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'app'>('login')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const [loginForm, setLoginForm] = useState({ email: '', teamName: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', teamName: '', coachName: '', password: '', confirmPassword: '' })
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'team' | 'game' | 'training' | 'calendar' | 'stats' | 'compare'>('dashboard')
  
  const [team, setTeam] = useState({ name: '', coach: '', email: '', category: '' })
  const [players, setPlayers] = useState<any[]>([])
  
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [playerForm, setPlayerForm] = useState({ name: '', number: '', position: '', height: '', birthDate: '', isStarter: false })
  
  const [matches, setMatches] = useState<any[]>([])
  const [trainingSessions, setTrainingSessions] = useState<any[]>([])
  
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [matchForm, setMatchForm] = useState({ opponent: '', date: '', time: '', location: '' })
  const [trainingForm, setTrainingForm] = useState({ type: 'Técnico', date: '', time: '', notes: '' })
  
  const [liveMatch, setLiveMatch] = useState<any>(null)
  const [liveTraining, setLiveTraining] = useState<any>(null)
  
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [currentSet, setCurrentSet] = useState(1)
  const [teamScore, setTeamScore] = useState({ team1: 0, team2: 0, sets1: 0, sets2: 0 })
  const [homeTimeouts, setHomeTimeouts] = useState(0)
  const [awayTimeouts, setAwayTimeouts] = useState(0)
  const [actions, setActions] = useState<any[]>([])
  
  const [substitutions, setSubstitutions] = useState<any[]>([])
  const [showSubModal, setShowSubModal] = useState(false)
  const [showSubHistory, setShowSubHistory] = useState(false)
  const [subForm, setSubForm] = useState({ playerOut: '', playerIn: '' })
  
  const [selectedStatPlayer, setSelectedStatPlayer] = useState<any>(null)
  const [comparePlayers, setComparePlayers] = useState<{ player1: any, player2: any }>({ player1: null, player2: null })
  
  // Mapa de Quadra - Estados novos
  const [showZoneSelector, setShowZoneSelector] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string, result: string, player?: any } | null>(null)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [zoneActions, setZoneActions] = useState<{ zone: number, count: number }[]>([])
  
  // Notas de Pós-Partida - Estados novos
  const [postGameNotes, setPostGameNotes] = useState<any[]>([])
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showNotesView, setShowNotesView] = useState(false)
  const [selectedMatchForNotes, setSelectedMatchForNotes] = useState<any>(null)
  const [selectedNoteForView, setSelectedNoteForView] = useState<any>(null)
  const [editingPostGameNote, setEditingPostGameNote] = useState<any>(null)
  
  // Substituições - matchSubstitutions para guardar substituições por partida
  const [matchSubstitutions, setMatchSubstitutions] = useState<{ [key: string]: any[] }>({})
  const [maxSubstitutions] = useState(6)
  
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']
  
  useEffect(() => {
    const saved = localStorage.getItem('scout_volei_user')
    if (saved) {
      const data = JSON.parse(saved)
      setTeam({ name: data.name, coach: data.coach, email: data.email, category: data.category || 'Adulto' })
      setCurrentScreen('app')
    }
    
    const savedPlayers = localStorage.getItem('scout_volei_players')
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers))
    
    const savedMatches = localStorage.getItem('scout_volei_matches')
    if (savedMatches) setMatches(JSON.parse(savedMatches))
    
    const savedTraining = localStorage.getItem('scout_volei_training')
    if (savedTraining) setTrainingSessions(JSON.parse(savedTraining))
    
    const savedRemember = localStorage.getItem('scout_volei_remember')
    if (savedRemember) {
      const data = JSON.parse(savedRemember)
      setLoginForm(data.login)
      setRememberMe(true)
    }
  }, [])
  
  useEffect(() => {
    let interval: any
    if (timerRunning && timerSeconds >= 0) {
      interval = setInterval(() => setTimerSeconds(p => p + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])
  
  useEffect(() => {
    localStorage.setItem('scout_volei_players', JSON.stringify(players))
  }, [players])
  
  useEffect(() => {
    localStorage.setItem('scout_volei_matches', JSON.stringify(matches))
  }, [matches])
  
  useEffect(() => {
    localStorage.setItem('scout_volei_training', JSON.stringify(trainingSessions))
  }, [trainingSessions])
  
  useEffect(() => {
    const savedNotes = localStorage.getItem('scout_volei_notes')
    if (savedNotes) setPostGameNotes(JSON.parse(savedNotes))
  }, [])
  
  useEffect(() => {
    localStorage.setItem('scout_volei_notes', JSON.stringify(postGameNotes))
  }, [postGameNotes])
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  
  const handleLogin = () => {
    setLoginError('')
    if (!loginForm.email || !loginForm.teamName || !loginForm.password) {
      setLoginError('Por favor, preencha todos os campos')
      return
    }
    
    const saved = localStorage.getItem('scout_volei_accounts')
    const accounts = saved ? JSON.parse(saved) : []
    const account = accounts.find((a: any) => a.email === loginForm.email && a.teamName === loginForm.teamName && a.password === loginForm.password)
    
    if (account) {
      if (rememberMe) {
        localStorage.setItem('scout_volei_remember', JSON.stringify({ login: loginForm }))
      }
      localStorage.setItem('scout_volei_user', JSON.stringify(account))
      setTeam({ name: account.name, coach: account.coach, email: account.email, category: account.category })
      setCurrentScreen('app')
    } else {
      setLoginError('Email, equipe ou senha incorretos')
    }
  }
  
  const handleRegister = () => {
    setLoginError('')
    if (!registerForm.email || !registerForm.teamName || !registerForm.coachName || !registerForm.password) {
      setLoginError('Por favor, preencha todos os campos')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setLoginError('As senhas não coincidem')
      return
    }
    
    const saved = localStorage.getItem('scout_volei_accounts')
    const accounts = saved ? JSON.parse(saved) : []
    const exists = accounts.find((a: any) => a.email === registerForm.email || a.teamName === registerForm.teamName)
    
    if (exists) {
      setLoginError('Email ou equipe já cadastrados')
      return
    }
    
    const newAccount = { email: registerForm.email, teamName: registerForm.teamName, name: registerForm.teamName, coach: registerForm.coachName, password: registerForm.password, category: 'Adulto' }
    accounts.push(newAccount)
    localStorage.setItem('scout_volei_accounts', JSON.stringify(accounts))
    localStorage.setItem('scout_volei_user', JSON.stringify(newAccount))
    setTeam({ name: newAccount.name, coach: newAccount.coach, email: newAccount.email, category: newAccount.category })
    setCurrentScreen('app')
  }
  
  const handleLogout = () => {
    localStorage.removeItem('scout_volei_user')
    localStorage.removeItem('scout_volei_remember')
    setCurrentScreen('login')
    setTeam({ name: '', coach: '', email: '', category: '' })
    setPlayers([])
    setMatches([])
    setTrainingSessions([])
    setMenuOpen(false)
    setLiveMatch(null)
    setLiveTraining(null)
    setTimerRunning(false)
    setTimerSeconds(0)
  }
  
  const handleDeleteAccount = () => {
    const saved = localStorage.getItem('scout_volei_accounts')
    if (saved) {
      const accounts = JSON.parse(saved).filter((a: any) => a.email !== team.email)
      localStorage.setItem('scout_volei_accounts', JSON.stringify(accounts))
    }
    localStorage.removeItem('scout_volei_user')
    localStorage.removeItem('scout_volei_players')
    localStorage.removeItem('scout_volei_matches')
    localStorage.removeItem('scout_volei_training')
    localStorage.removeItem('scout_volei_remember')
    handleLogout()
  }
  
  const handlePlayerSubmit = () => {
    if (!playerForm.name || !playerForm.number || !playerForm.position || !playerForm.height) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    if (editingPlayer) {
      setPlayers(players.map(p => p.id === editingPlayer.id ? { ...playerForm, id: editingPlayer.id } : p))
      setEditingPlayer(null)
    } else {
      setPlayers([...players, { ...playerForm, id: Date.now() }])
    }
    setPlayerForm({ name: '', number: '', position: '', height: '', birthDate: '', isStarter: false })
    setShowPlayerModal(false)
  }
  
  const editPlayer = (player: any) => {
    setEditingPlayer(player)
    setPlayerForm({ ...player })
    setShowPlayerModal(true)
  }
  
  const deletePlayer = (id: number) => {
    if (confirm('Deseja excluir este jogador?')) {
      setPlayers(players.filter(p => p.id !== id))
    }
  }
  
  const startMatch = () => {
    if (!matchForm.opponent) {
      alert('Preencha o adversário')
      return
    }
    const newMatch = { id: Date.now(), opponent: matchForm.opponent, date: matchForm.date, time: matchForm.time, status: 'scheduled', actions: [], teamScore: { team1: 0, team2: 0, sets1: 0, sets2: 0 }, homeTimeouts: 0, awayTimeouts: 0, substitutions: [] }
    setMatches([...matches, newMatch])
    setLiveMatch(newMatch)
    setTeamScore({ team1: 0, team2: 0, sets1: 0, sets2: 0 })
    setHomeTimeouts(0)
    setAwayTimeouts(0)
    setActions([])
    setSubstitutions([])
    setTimerRunning(true)
    setTimerSeconds(0)
    setCurrentSet(1)
    setShowMatchModal(false)
  }
  
  const startTraining = () => {
    const newTraining = { id: Date.now(), type: trainingForm.type, date: trainingForm.date, time: trainingForm.time, notes: trainingForm.notes, status: 'scheduled', actions: [] }
    setTrainingSessions([...trainingSessions, newTraining])
    setLiveTraining(newTraining)
    setActions([])
    setTimerRunning(true)
    setTimerSeconds(0)
    setShowTrainingModal(false)
  }
  
  const startActionWithZone = (type: string, result: string) => {
    if (!selectedPlayer) {
      alert('Selecione um jogador')
      return
    }
    setPendingAction({ type, result, player: selectedPlayer })
    setSelectedZone(null)
    setShowZoneSelector(true)
  }

  const completeActionWithZone = (zone: number) => {
    if (!pendingAction || !selectedZone) return
    
    const newAction = { 
      id: Date.now(), 
      playerId: pendingAction.player.id, 
      playerNumber: pendingAction.player.number, 
      playerName: pendingAction.player.name, 
      type: pendingAction.type, 
      result: pendingAction.result, 
      zone: zone,
      time: formatTime(timerSeconds), 
      set: currentSet 
    }
    setActions([...actions, newAction])
    
    // Atualizar contagem de ações por zona
    setZoneActions(prev => {
      const existing = prev.find(p => p.zone === zone)
      if (existing) {
        return prev.map(p => p.zone === zone ? { ...p, count: p.count + 1 } : p)
      } else {
        return [...prev, { zone, count: 1 }]
      }
    })
    
    if (liveMatch) {
      if ((pendingAction.type === 'Ataque' && pendingAction.result === 'Ponto') || 
          (pendingAction.type === 'Saque' && pendingAction.result === 'Ace') || 
          (pendingAction.type === 'Bloqueio' && pendingAction.result === 'Ponto')) {
        setTeamScore({ ...teamScore, team1: teamScore.team1 + 1 })
      }
    }
  }

  const recordAction = (type: string, result: string) => {
    if (!selectedPlayer) {
      alert('Selecione um jogador')
      return
    }
    const newAction = { id: Date.now(), playerId: selectedPlayer.id, playerNumber: selectedPlayer.number, playerName: selectedPlayer.name, type, result, time: formatTime(timerSeconds), set: currentSet }
    setActions([...actions, newAction])
    if (liveMatch) {
      if ((type === 'Ataque' && result === 'Ponto') || (type === 'Saque' && result === 'Ace') || (type === 'Bloqueio' && result === 'Ponto')) {
        setTeamScore({ ...teamScore, team1: teamScore.team1 + 1 })
      }
    }
  }
  
  const undoAction = () => {
    if (actions.length === 0) return
    const lastAction = actions[actions.length - 1]
    setActions(actions.slice(0, -1))
    if (liveMatch && (lastAction.type === 'Ataque' && lastAction.result === 'Ponto') || (lastAction.type === 'Saque' && lastAction.result === 'Ace') || (lastAction.type === 'Bloqueio' && lastAction.result === 'Ponto')) {
      setTeamScore({ team1: Math.max(0, teamScore.team1 - 1), team2: teamScore.team2, sets1: teamScore.sets1, sets2: teamScore.sets2 })
    }
  }
  
  const requestTimeout = (team: 'home' | 'away') => {
    if (team === 'home' && homeTimeouts < 2) setHomeTimeouts(homeTimeouts + 1)
    if (team === 'away' && awayTimeouts < 2) setAwayTimeouts(awayTimeouts + 1)
  }
  
  const handleSubstitution = () => {
    if (!subForm.playerOut || !subForm.playerIn) {
      alert('Selecione os dois jogadores')
      return
    }
    const newSub = { id: Date.now(), playerOut: subForm.playerOut, playerIn: subForm.playerIn, time: formatTime(timerSeconds), set: currentSet }
    setSubstitutions([...substitutions, newSub])
    setLiveMatch({ ...liveMatch, substitutions: [...liveMatch.substitutions, newSub] })
    setShowSubModal(false)
    setSubForm({ playerOut: '', playerIn: '' })
  }
  
  const adjustScore = (team: 'team1' | 'team2', delta: number) => {
    const newScore = { ...teamScore, [team]: Math.max(0, teamScore[team] + delta) }
    setTeamScore(newScore)
    if (liveMatch) setLiveMatch({ ...liveMatch, teamScore: newScore })
  
    if (newScore.team1 >= 25 && newScore.team1 - newScore.team2 >= 2) {
      setTeamScore({ ...newScore, sets1: teamScore.sets1 + 1 })
      if (liveMatch) setLiveMatch({ ...liveMatch, teamScore: { ...newScore, sets1: teamScore.sets1 + 1 } })
    }
    if (newScore.team2 >= 25 && newScore.team2 - newScore.team1 >= 2) {
      setTeamScore({ ...newScore, sets2: teamScore.sets2 + 1 })
      if (liveMatch) setLiveMatch({ ...liveMatch, teamScore: { ...newScore, sets2: teamScore.sets2 + 1 } })
    }
  }
  
  const endMatch = () => {
    if (!liveMatch) return
    setTimerRunning(false)
    const finalMatch = { ...liveMatch, status: 'completed', actions: actions, teamScore: teamScore, homeTimeouts, awayTimeouts, substitutions }
    setMatches(matches.map(m => m.id === liveMatch.id ? finalMatch : m))
    setLiveMatch(null)
    setTeamScore({ team1: 0, team2: 0, sets1: 0, sets2: 0 })
    setHomeTimeouts(0)
    setAwayTimeouts(0)
    setActions([])
    setSubstitutions([])
    setTimerSeconds(0)
  }
  
  const endTraining = () => {
    if (!liveTraining) return
    setTimerRunning(false)
    const finalTraining = { ...liveTraining, status: 'completed', actions: actions }
    setTrainingSessions(trainingSessions.map(t => t.id === liveTraining.id ? finalTraining : t))
    setLiveTraining(null)
    setActions([])
    setTimerSeconds(0)
  }
  
  const getPlayerStats = (playerId: number) => {
    const stats = { attack: 0, attackPoints: 0, attackErrors: 0, block: 0, blockPoints: 0, blockErrors: 0, serve: 0, serveAces: 0, serveSuccess: 0, serveErrors: 0, defense: 0, defenseSuccess: 0, defenseErrors: 0, reception: 0, receptionPerfect: 0, receptionGood: 0, receptionErrors: 0, set: 0, setPerfect: 0, setRegular: 0, setBad: 0, cards: 0, cardsYellow: 0, cardsRed: 0 }
    
    matches.forEach(match => {
      match.actions?.forEach((action: any) => {
        if (action.playerId === playerId) {
          if (action.type === 'Ataque') { stats.attack++; if (action.result === 'Ponto') stats.attackPoints++; else if (action.result === 'Erro') stats.attackErrors++ }
          else if (action.type === 'Bloqueio') { stats.block++; if (action.result === 'Ponto') stats.blockPoints++; else if (action.result === 'Erro') stats.blockErrors++ }
          else if (action.type === 'Saque') { stats.serve++; if (action.result === 'Ace') stats.serveAces++; else if (action.result === 'Sucesso') stats.serveSuccess++; else if (action.result === 'Erro') stats.serveErrors++ }
          else if (action.type === 'Defesa') { stats.defense++; if (action.result === 'Sucesso') stats.defenseSuccess++; else if (action.result === 'Erro') stats.defenseErrors++ }
          else if (action.type === 'Recepção') { stats.reception++; if (action.result === 'Perfeita') stats.receptionPerfect++; else if (action.result === 'Boa') stats.receptionGood++; else if (action.result === 'Erro') stats.receptionErrors++ }
          else if (action.type === 'Levantamento') { stats.set++; if (action.result === 'Perfeito') stats.setPerfect++; else if (action.result === 'Regular') stats.setRegular++; else if (action.result === 'Ruim') stats.setBad++ }
          else if (action.type === 'Cartão') { stats.cards++; if (action.result === 'Amarelo') stats.cardsYellow++; else if (action.result === 'Vermelho') stats.cardsRed++ }
        }
      })
    })
    return stats
  }
  
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) { alert('Sem dados para exportar'); return }
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
  }
  
  const exportPlayerStatsCSV = () => {
    const csvData = players.map(p => {
      const stats = getPlayerStats(p.id)
      return {
        jogador: p.name, numero: p.number, posicao: p.position,
        ataque_pontos: stats.attackPoints, ataque_erros: stats.attackErrors, ataque_eficiencia: stats.attack > 0 ? ((stats.attackPoints / stats.attack) * 100).toFixed(1) + '%' : '0%',
        bloqueio_pontos: stats.blockPoints, bloqueio_erros: stats.blockErrors,
        saque_aces: stats.serveAces, saque_erros: stats.serveErrors,
        defesa_sucesso: stats.defenseSuccess, defesa_erros: stats.defenseErrors,
        recepcao_perfeita: stats.receptionPerfect, recepcao_boa: stats.receptionGood,
        levantamento_perfeito: stats.setPerfect, levantamento_regular: stats.setRegular
      }
    })
    exportToCSV(csvData, `estatisticas_jogadores_${team.name}`)
  }
  
  const exportMatchCSV = (match: any) => {
    if (!match.actions || match.actions.length === 0) { alert('Sem dados para exportar'); return }
    const csvData = match.actions.map((action: any) => ({
      jogador: action.playerName, numero: action.playerNumber, acao: action.type, resultado: action.result, tempo: action.time, set: action.set
    }))
    exportToCSV(csvData, `partida_${match.opponent}_${match.date}`)
  }
  
  const getChartData = () => {
    return players.map(p => {
      const stats = getPlayerStats(p.id)
      return { name: `#${p.number}`, Ataque: stats.attackPoints, Bloqueio: stats.blockPoints, Saque: stats.serveAces, Defesa: stats.defenseSuccess, Recepcao: stats.receptionPerfect, Levantamento: stats.setPerfect }
    })
  }
  
  const getPieData = () => {
    const totalAttacks = actions.filter(a => a.type === 'Ataque').length
    const points = actions.filter(a => a.type === 'Ataque' && a.result === 'Ponto').length
    const errors = actions.filter(a => a.type === 'Ataque' && a.result === 'Erro').length
    const others = totalAttacks - points - errors
    return [
      { name: 'Pontos', value: points, color: '#10B981' },
      { name: 'Erros', value: errors, color: '#EF4444' },
      { name: 'Outros', value: Math.max(0, others), color: '#8B5CF6' }
    ]
  }
  
  // Funções para Notas de Pós-Partida
  const handleOpenNotesModal = (match: any) => {
    setSelectedMatchForNotes(match)
    setEditingPostGameNote(null)
    setShowNotesModal(true)
    setShowNotesView(false)
  }
  
  const handleSavePostGameNote = (note: any) => {
    if (editingPostGameNote) {
      // Editar nota existente
      setPostGameNotes(postGameNotes.map(n => 
        n.playerId === note.playerId && n.matchId === note.matchId ? note : n
      ))
    } else {
      // Adicionar nova nota
      setPostGameNotes([...postGameNotes, note])
    }
    setShowNotesModal(false)
    setEditingPostGameNote(null)
  }
  
  const handleViewNotes = (match: any, playerId?: string) => {
    if (playerId) {
      // Ver nota específica de um jogador
      const note = postGameNotes.find(n => n.matchId === match.id && n.playerId === playerId)
      if (note) {
        setSelectedNoteForView({ ...note, opponentName: match.opponent })
        setShowNotesView(true)
        setShowNotesModal(false)
      }
    } else {
      // Ver se tem notas para esta partida
      const matchNotes = postGameNotes.filter(n => n.matchId === match.id)
      if (matchNotes.length > 0) {
        // Se tiver apenas uma nota, mostra ela direto
        if (matchNotes.length === 1) {
          setSelectedNoteForView({ ...matchNotes[0], opponentName: match.opponent })
        } else {
          // Se tiver múltiplas notas, mostra a primeira
          setSelectedNoteForView({ ...matchNotes[0], opponentName: match.opponent })
        }
        setShowNotesView(true)
        setShowNotesModal(false)
      }
    }
  }
  
  const handleEditPostGameNote = (note: any) => {
    setEditingPostGameNote(note)
    setShowNotesView(false)
    setShowNotesModal(true)
  }
  
  const getNotesForMatch = (matchId: string) => {
    return postGameNotes.filter(n => n.matchId === matchId)
  }
  
  const getNotesForPlayer = (playerId: string) => {
    return postGameNotes.filter(n => n.playerId === playerId)
  }
  
  const getTeamStatsForMatch = (match: any) => {
    if (!match.actions) return []
    
    const statsByPlayer: any = {}
    match.actions.forEach((action: any) => {
      if (!statsByPlayer[action.playerId]) {
        statsByPlayer[action.playerId] = {
          attackPoints: 0, attackErrors: 0,
          blockPoints: 0, blockErrors: 0,
          serveAces: 0, serveErrors: 0,
          defenseSuccess: 0, defenseErrors: 0,
          receptionPerfect: 0, receptionGood: 0, receptionErrors: 0,
          setPerfect: 0, setRegular: 0, setErrors: 0,
          cardsYellow: 0, cardsRed: 0
        }
      }
      const stats = statsByPlayer[action.playerId]
      if (action.type === 'Ataque') {
        if (action.result === 'Ponto') stats.attackPoints++
        else if (action.result === 'Erro') stats.attackErrors++
      }
      else if (action.type === 'Bloqueio') {
        if (action.result === 'Ponto') stats.blockPoints++
        else if (action.result === 'Erro') stats.blockErrors++
      }
      else if (action.type === 'Saque') {
        if (action.result === 'Ace') stats.serveAces++
        else if (action.result === 'Erro') stats.serveErrors++
      }
      else if (action.type === 'Defesa') {
        if (action.result === 'Sucesso') stats.defenseSuccess++
        else if (action.result === 'Erro') stats.defenseErrors++
      }
      else if (action.type === 'Recepção') {
        if (action.result === 'Perfeita') stats.receptionPerfect++
        else if (action.result === 'Boa') stats.receptionGood++
        else if (action.result === 'Erro') stats.receptionErrors++
      }
      else if (action.type === 'Levantamento') {
        if (action.result === 'Perfeito') stats.setPerfect++
        else if (action.result === 'Regular') stats.setRegular++
        else if (action.result === 'Ruim') stats.setErrors++
      }
      else if (action.type === 'Cartão') {
        if (action.result === 'Amarelo') stats.cardsYellow++
        else if (action.result === 'Vermelho') stats.cardsRed++
      }
    })
    
    return Object.entries(statsByPlayer).map(([playerId, stats]) => ({
      playerId,
      ...(stats as any)
    }))
  }
  
  const getEfficiencyData = () => {
    return players.map(p => {
      const stats = getPlayerStats(p.id)
      return {
        name: p.name,
        Ataque: stats.attack > 0 ? Math.round((stats.attackPoints / stats.attack) * 100) : 0,
        Bloqueio: stats.block > 0 ? Math.round((stats.blockPoints / stats.block) * 100) : 0,
        Saque: stats.serve > 0 ? Math.round((stats.serveAces / stats.serve) * 100) : 0,
        Defesa: stats.defense > 0 ? Math.round((stats.defenseSuccess / stats.defense) * 100) : 0
      }
    })
  }
  
  const getPositionComparison = () => {
    const positions = ['Levantador', 'Ponteiro', 'Central', 'Oposto', 'Líbero']
    return positions.map(pos => {
      const posPlayers = players.filter(p => p.position === pos)
      let total = 0, points = 0
      posPlayers.forEach(p => {
        const stats = getPlayerStats(p.id)
        total += stats.attack
        points += stats.attackPoints
      })
      return { position: pos, efficiency: total > 0 ? Math.round((points / total) * 100) : 0, players: posPlayers.length }
    })
  }
  
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/20">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Scout de Vôlei</h2>
          <p className="text-center text-purple-400 mb-6">Login</p>
          
          {loginError && (
            <div className="bg-gray-700 border-l-4 border-red-500 p-3 mb-4 rounded-lg">
              <p className="text-red-400 text-sm">{loginError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Nome da Equipe" value={loginForm.teamName} onChange={e => setLoginForm({...loginForm, teamName: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-purple-500 focus:ring-purple-500/20" />
              Lembrar dados
            </label>
            
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Entrar
            </button>
            
            <p className="text-center text-gray-400">
              Não tem conta? <button onClick={() => setCurrentScreen('register')} className="text-purple-400 hover:text-purple-300 font-medium">Criar nova conta</button>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (currentScreen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/20">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Scout de Vôlei</h2>
          <p className="text-center text-purple-400 mb-6">Cadastro</p>
          
          {loginError && (
            <div className="bg-gray-700 border-l-4 border-red-500 p-3 mb-4 rounded-lg">
              <p className="text-red-400 text-sm">{loginError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Nome da Equipe" value={registerForm.teamName} onChange={e => setRegisterForm({...registerForm, teamName: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Nome do Técnico" value={registerForm.coachName} onChange={e => setRegisterForm({...registerForm, coachName: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="Senha" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="Confirmar Senha" value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" />
            </div>
            
            <button onClick={handleRegister} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Criar Conta
            </button>
            
            <p className="text-center text-gray-400">
              Já tem conta? <button onClick={() => setCurrentScreen('login')} className="text-purple-400 hover:text-purple-300 font-medium">Login</button>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  const tabItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'team', icon: Users, label: 'Equipe' },
    { id: 'game', icon: Trophy, label: 'Jogo' },
    { id: 'training', icon: Dumbbell, label: 'Treino' },
    { id: 'calendar', icon: Calendar, label: 'Calendário' },
    { id: 'stats', icon: Activity, label: 'Estatísticas' },
    { id: 'compare', icon: GitCompare, label: 'Comparar' },
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-gray-800/95 backdrop-blur-xl border-r border-purple-500/30 shadow-2xl shadow-black/50 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">{team.name}</p>
                <p className="text-gray-400 text-sm">{team.coach}</p>
              </div>
            </div>
            
            <nav className="flex-1 space-y-2">
              {tabItems.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
                <button onClick={() => { setShowEditModal(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-gray-700/50 hover:text-white">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Editar Equipe</span>
                </button>
                <button onClick={() => { setShowDeleteModal(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300">
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Excluir Conta</span>
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-gray-700/50 hover:text-white">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs text-center">{team.email}</p>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-800/95 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-red-500/20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Excluir Conta</h3>
            <p className="text-gray-400 text-center mb-6">Esta ação é irreversível. Todos os dados (equipe, jogadores, partidas, treinos) serão excluídos permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors">Cancelar</button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-500 transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}
      
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Editar Equipe</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Nome da Equipe</label>
                <input type="text" value={team.name} onChange={e => setTeam({...team, name: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Categoria</label>
                <select value={team.category} onChange={e => setTeam({...team, category: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                  <option value="Infanto">Infanto</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Técnico</label>
                <input type="text" value={team.coach} onChange={e => setTeam({...team, coach: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600">Cancelar</button>
                <button onClick={() => { localStorage.setItem('scout_volei_user', JSON.stringify({ ...team, email: team.email, password: registerForm.password })); setShowEditModal(false); }} className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubModal(false)} />
          <div className="relative bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Substituição</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Jogador Saindo</label>
                <select value={subForm.playerOut} onChange={e => setSubForm({...subForm, playerOut: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                  <option value="">Selecione...</option>
                  {players.filter(p => !substitutions.map(s => s.playerIn).includes(p.number.toString())).map(p => (
                    <option key={p.id} value={p.number}>{p.number} - {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Jogador Entrando</label>
                <select value={subForm.playerIn} onChange={e => setSubForm({...subForm, playerIn: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                  <option value="">Selecione...</option>
                  {players.filter(p => p.number.toString() !== subForm.playerOut).map(p => (
                    <option key={p.id} value={p.number}>{p.number} - {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSubModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600">Cancelar</button>
                <button onClick={handleSubstitution} className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {showSubHistory && (
        <SubstitutionHistory
          substitutions={substitutions}
          onCloseHistory={() => setShowSubHistory(false)}
          currentSet={currentSet}
        />
      )}
  
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setMenuOpen(true)} className="p-2 lg:hidden hover:bg-gray-800 rounded-lg transition-colors">
                <Menu className="w-6 h-6 text-purple-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">{team.name || 'Scout de Vôlei'}</h1>
                  <p className="text-purple-400 text-xs">{team.coach}</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-2">
              {tabItems.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-purple-400">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <nav className="lg:hidden border-t border-gray-800/50 px-4 py-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabItems.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-gray-800/50'}`}>
                <tab.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <p className="text-gray-400">Visão geral da equipe</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportPlayerStatsCSV} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20">
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
                <ExportPDFButton type="stats" teamName={team.name} coach={team.coach} players={players} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{players.length}</p>
                    <p className="text-gray-400 text-xs">Jogadores</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{matches.filter(m => m.status === 'completed').length}</p>
                    <p className="text-gray-400 text-xs">Partidas</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{trainingSessions.filter(t => t.status === 'completed').length}</p>
                    <p className="text-gray-400 text-xs">Treinos</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{matches.reduce((acc, m) => acc + (m.actions?.length || 0), 0) + trainingSessions.reduce((acc, t) => acc + (t.actions?.length || 0), 0)}</p>
                    <p className="text-gray-400 text-xs">Ações Scout</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Desempenho por Jogador</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Ataque" fill="#8B5CF6" name="Ataque" />
                    <Bar dataKey="Bloqueio" fill="#10B981" name="Bloqueio" />
                    <Bar dataKey="Defesa" fill="#3B82F6" name="Defesa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Ataques</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={getPieData()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {getPieData().map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Eficiência por Categoria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getEfficiencyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="Ataque" stroke="#8B5CF6" name="Ataque %" strokeWidth={2} />
                    <Line type="monotone" dataKey="Saque" stroke="#10B981" name="Saque %" strokeWidth={2} />
                    <Line type="monotone" dataKey="Defesa" stroke="#3B82F6" name="Defesa %" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Eficiência por Posição</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getPositionComparison()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="position" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="efficiency" fill="#F59E0B" name="Eficiência %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Equipe</h2>
                <p className="text-gray-400">{team.category} • Técnico: {team.coach}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowPlayerModal(true); setEditingPlayer(null); setPlayerForm({ name: '', number: '', position: '', height: '', birthDate: '', isStarter: false }); }} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Jogador</span>
                </button>
                <ExportPDFButton type="team" teamName={team.name} coach={team.coach} players={players} />
              </div>
            </div>
            
            {showPlayerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPlayerModal(false)} />
                <div className="relative bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">{editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Nome" value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    <input type="text" placeholder="Número da Camisa" value={playerForm.number} onChange={e => setPlayerForm({...playerForm, number: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    <select value={playerForm.position} onChange={e => setPlayerForm({...playerForm, position: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                      <option value="">Selecione a posição...</option>
                      <option value="Levantador">Levantador</option>
                      <option value="Ponteiro">Ponteiro</option>
                      <option value="Central">Central</option>
                      <option value="Oposto">Oposto</option>
                      <option value="Líbero">Líbero</option>
                    </select>
                    <input type="text" placeholder="Altura (ex: 1.85)" value={playerForm.height} onChange={e => setPlayerForm({...playerForm, height: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={playerForm.isStarter} onChange={e => setPlayerForm({...playerForm, isStarter: e.target.checked})} className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-purple-500 focus:ring-purple-500/20" />
                      <label className="text-gray-400">Titular</label>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowPlayerModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600">Cancelar</button>
                      <button onClick={handlePlayerSubmit} className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500">Salvar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-purple-400 text-xs font-semibold uppercase">Número</th>
                      <th className="px-4 py-3 text-left text-purple-400 text-xs font-semibold uppercase">Nome</th>
                      <th className="px-4 py-3 text-left text-purple-400 text-xs font-semibold uppercase">Posição</th>
                      <th className="px-4 py-3 text-left text-purple-400 text-xs font-semibold uppercase">Altura</th>
                      <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Status</th>
                      <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 text-white font-semibold">#{player.number}</td>
                        <td className="px-4 py-3 text-white">{player.name}</td>
                        <td className="px-4 py-3 text-gray-400">{player.position}</td>
                        <td className="px-4 py-3 text-gray-400">{player.height}m</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${player.isStarter ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                            {player.isStarter ? 'Titular' : 'Reserva'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => editPlayer(player)} className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-400">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button onClick={() => deletePlayer(player.id)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {players.length === 0 && (
                <div className="p-8 text-center text-gray-500">Nenhum jogador cadastrado</div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'game' && (
          <div className="space-y-6">
            {liveMatch ? (
              <div className="space-y-4">
                <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{team.name} vs {liveMatch.opponent}</h2>
                      <p className="text-gray-400">Set {currentSet} • {formatTime(timerSeconds)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setTimerRunning(!timerRunning)} className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
                        {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button onClick={undoAction} className="p-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={endMatch} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors">Encerrar</button>
                      <button onClick={() => setShowSubModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">Substituição</button>
                      <button onClick={() => setShowSubHistory(true)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Histórico
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-400 mb-1">{team.name}</p>
                      <p className="text-4xl font-bold text-white mb-2">{teamScore.team1}</p>
                      <p className="text-xs text-gray-400">Sets: {teamScore.sets1}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-400 mb-1">{liveMatch.opponent}</p>
                      <p className="text-4xl font-bold text-white mb-2">{teamScore.team2}</p>
                      <p className="text-xs text-gray-400">Sets: {teamScore.sets2}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Timeouts {team.name}</p>
                      <div className="flex gap-1">
                        {[1, 2].map(i => <div key={i} className={`w-4 h-4 rounded ${i <= homeTimeouts ? 'bg-red-500' : 'bg-gray-700'}`} />)}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Timeouts {liveMatch.opponent}</p>
                      <div className="flex gap-1">
                        {[1, 2].map(i => <div key={i} className={`w-4 h-4 rounded ${i <= awayTimeouts ? 'bg-red-500' : 'bg-gray-700'}`} />)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    <button onClick={() => {
                      if (currentSet > 1) setCurrentSet(currentSet - 1)
                    }} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                    {[1, 2, 3, 4, 5].map(set => (
                      <button key={set} onClick={() => setCurrentSet(set)} className={`px-3 py-1 rounded-lg ${currentSet === set ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>{set}</button>
                    ))}
                    <button onClick={() => {
                      if (currentSet < 5) setCurrentSet(currentSet + 1)
                    }} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-400 mb-3">Jogadores em Quadra</h3>
                    <div className="flex flex-wrap gap-2">
                      {players.map(player => (
                        <button key={player.id} onClick={() => setSelectedPlayer(player)} className={`px-4 py-2 rounded-xl transition-all ${selectedPlayer?.id === player.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                          #{player.number} {player.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400 mb-3">Ações de Scout</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">⚡ Ataque</p>
                        <div className="flex gap-1">
                          <button onClick={() => startActionWithZone('Ataque', 'Ponto')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Ponto</button>
                          <button onClick={() => startActionWithZone('Ataque', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">Erro</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🛡️ Bloqueio</p>
                        <div className="flex gap-1">
                          <button onClick={() => startActionWithZone('Bloqueio', 'Ponto')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Ponto</button>
                          <button onClick={() => startActionWithZone('Bloqueio', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">Erro</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🎾 Saque</p>
                        <div className="flex gap-1 flex-col">
                          <button onClick={() => startActionWithZone('Saque', 'Ace')} className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Ace</button>
                          <div className="flex gap-1">
                            <button onClick={() => startActionWithZone('Saque', 'Sucesso')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg">✓</button>
                            <button onClick={() => startActionWithZone('Saque', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🤲 Recepção</p>
                        <div className="flex gap-1 flex-col">
                          <button onClick={() => startActionWithZone('Recepção', 'Perfeita')} className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Perfeita</button>
                          <div className="flex gap-1">
                            <button onClick={() => startActionWithZone('Recepção', 'Boa')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg">Boa</button>
                            <button onClick={() => startActionWithZone('Recepção', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">Erro</button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">💨 Levantamento</p>
                        <div className="flex gap-1 flex-col">
                          <button onClick={() => recordAction('Levantamento', 'Perfeito')} className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Perfeito</button>
                          <div className="flex gap-1">
                            <button onClick={() => recordAction('Levantamento', 'Regular')} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-2 rounded-lg">Regular</button>
                            <button onClick={() => recordAction('Levantamento', 'Ruim')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">Ruim</button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">👐 Defesa</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Defesa', 'Sucesso')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">✓</button>
                          <button onClick={() => recordAction('Defesa', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 mb-1">⚠️ Cartões</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Cartão', 'Amarelo')} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-2 rounded-lg">🟨</button>
                          <button onClick={() => recordAction('Cartão', 'Vermelho')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">🟥</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">Timeout</p>
                        <div className="flex gap-1">
                          <button onClick={() => requestTimeout('home')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg">Você</button>
                          <button onClick={() => requestTimeout('away')} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-xs py-2 rounded-lg">Adv</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3 col-span-2">
                        <p className="text-xs text-gray-400 mb-2">Ajuste Placar</p>
                        <div className="flex justify-between gap-2">
                          <p className="text-xs text-gray-400 self-center">{team.name}</p>
                          <div className="flex gap-1">
                            <button onClick={() => adjustScore('team1', -1)} className="px-2 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">-</button>
                            <button onClick={() => adjustScore('team1', 1)} className="px-2 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">+</button>
                          </div>
                          <p className="text-xs text-gray-400 self-center">{liveMatch.opponent}</p>
                          <div className="flex gap-1">
                            <button onClick={() => adjustScore('team2', -1)} className="px-2 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">-</button>
                            <button onClick={() => adjustScore('team2', 1)} className="px-2 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {substitutions.length > 0 && (
                  <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                    <h3 className="text-sm text-gray-400 mb-3">Substituições</h3>
                    <div className="space-y-2">
                      {substitutions.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-white">#{sub.playerOut} → #{sub.playerIn}</span>
                          <span className="text-xs text-gray-400">{sub.time} (Set {sub.set})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {actions.length > 0 && (
                  <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                    <h3 className="text-sm text-gray-400 mb-3">Últimas Ações</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {actions.slice().reverse().map((action) => (
                        <div key={action.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-white">#{action.playerNumber} {action.playerName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-400">{action.type}</span>
                            <span className={`text-xs px-2 py-1 rounded ${action.result === 'Ponto' || action.result === 'Ace' || action.result === 'Perfeito' ? 'bg-green-500/20 text-green-400' : action.result === 'Erro' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{action.result}</span>
                            <span className="text-xs text-gray-400">{action.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Partidas</h2>
                    <p className="text-gray-400">Gerencie suas partidas e scout</p>
                  </div>
                  <button onClick={() => setShowMatchModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20">
                    <Trophy className="w-4 h-4" />
                    <span>Nova Partida</span>
                  </button>
                </div>
                
                {showMatchModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMatchModal(false)} />
                    <div className="relative bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <h3 className="text-xl font-bold text-white mb-4">Nova Partida</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="Adversário" value={matchForm.opponent} onChange={e => setMatchForm({...matchForm, opponent: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        <input type="date" value={matchForm.date} onChange={e => setMatchForm({...matchForm, date: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        <input type="time" value={matchForm.time} onChange={e => setMatchForm({...matchForm, time: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        <div className="flex gap-3">
                          <button onClick={() => setShowMatchModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600">Cancelar</button>
                          <button onClick={startMatch} className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500">Iniciar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((match) => (
                    <div key={match.id} className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{team.name} vs {match.opponent}</h3>
                          <p className="text-gray-400 text-sm">{match.date} às {match.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.status === 'completed' ? 'bg-green-500/20 text-green-400' : match.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'}`}>
                          {match.status === 'completed' ? 'Finalizada' : match.status === 'in-progress' ? 'Em andamento' : 'Agendada'}
                        </span>
                      </div>
                      {match.status === 'completed' && match.teamScore && (
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-white">Sets {match.teamScore.sets1} - {match.teamScore.sets2}</span>
                          <span className="text-white">{match.teamScore.team1} - {match.teamScore.team2}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {match.status !== 'in-progress' && (
                          <button onClick={() => { setLiveMatch(match); setTeamScore(match.teamScore || { team1: 0, team2: 0, sets1: 0, sets2: 0 }); setActions([]); setTimerRunning(true); }} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-sm py-2 rounded-xl transition-colors">
                            {match.status === 'completed' ? 'Ver Scout' : 'Iniciar Scout'}
                          </button>
                        )}
                        {match.status === 'completed' && match.actions && match.actions.length > 0 && (
                          <>
                            <button onClick={() => exportMatchCSV(match)} className="px-3 bg-green-600 hover:bg-green-500 text-white text-sm py-2 rounded-xl transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <ExportPDFButton type="match" teamName={team.name} coach={team.coach} players={players} match={match} />
                            <PostGameNotesButton
                              onClick={() => handleOpenNotesModal(match)}
                              hasNotes={getNotesForMatch(match.id).length > 0}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <div className="col-span-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center text-gray-500">
                      Nenhuma partida cadastrada
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'training' && (
          <div className="space-y-6">
            {liveTraining ? (
              <div className="space-y-4">
                <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Treino: {liveTraining.type}</h2>
                      <p className="text-gray-400">{formatTime(timerSeconds)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setTimerRunning(!timerRunning)} className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
                        {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button onClick={undoAction} className="p-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={endTraining} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors">Encerrar</button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-400 mb-3">Jogadores</h3>
                    <div className="flex flex-wrap gap-2">
                      {players.map(player => (
                        <button key={player.id} onClick={() => setSelectedPlayer(player)} className={`px-4 py-2 rounded-xl transition-all ${selectedPlayer?.id === player.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                          #{player.number} {player.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400 mb-3">Ações de Scout</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">⚡ Ataque</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Ataque', 'Ponto')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">✓</button>
                          <button onClick={() => recordAction('Ataque', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🛡️ Bloqueio</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Bloqueio', 'Ponto')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">✓</button>
                          <button onClick={() => recordAction('Bloqueio', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🎾 Saque</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Saque', 'Sucesso')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">✓</button>
                          <button onClick={() => recordAction('Saque', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">🤲 Recepção</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Recepção', 'Perfeita')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">Perf</button>
                          <button onClick={() => recordAction('Recepção', 'Boa')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg">Boa</button>
                          <button onClick={() => recordAction('Recepção', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">Erro</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">💨 Levantamento</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Levantamento', 'Perfeito')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">P</button>
                          <button onClick={() => recordAction('Levantamento', 'Regular')} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-2 rounded-lg">R</button>
                          <button onClick={() => recordAction('Levantamento', 'Ruim')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-2">👐 Defesa</p>
                        <div className="flex gap-1">
                          <button onClick={() => recordAction('Defesa', 'Sucesso')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded-lg">✓</button>
                          <button onClick={() => recordAction('Defesa', 'Erro')} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg">✗</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {actions.length > 0 && (
                  <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
                    <h3 className="text-sm text-gray-400 mb-3">Últimas Ações</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {actions.slice().reverse().map((action) => (
                        <div key={action.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-white">#{action.playerNumber} {action.playerName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-400">{action.type}</span>
                            <span className={`text-xs px-2 py-1 rounded ${action.result === 'Ponto' || action.result === 'Ace' || action.result === 'Perfeito' ? 'bg-green-500/20 text-green-400' : action.result === 'Erro' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{action.result}</span>
                            <span className="text-xs text-gray-400">{action.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Treinos</h2>
                    <p className="text-gray-400">Gerencie seus treinos e scout</p>
                  </div>
                  <button onClick={() => setShowTrainingModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20">
                    <Dumbbell className="w-4 h-4" />
                    <span>Novo Treino</span>
                  </button>
                </div>
                
                {showTrainingModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTrainingModal(false)} />
                    <div className="relative bg-gray-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                      <h3 className="text-xl font-bold text-white mb-4">Novo Treino</h3>
                      <div className="space-y-4">
                        <select value={trainingForm.type} onChange={e => setTrainingForm({...trainingForm, type: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                          <option value="Técnico">Técnico</option>
                          <option value="Tático">Tático</option>
                          <option value="Físico">Físico</option>
                          <option value="Mental">Mental</option>
                          <option value="Videoanálise">Videoanálise</option>
                        </select>
                        <input type="date" value={trainingForm.date} onChange={e => setTrainingForm({...trainingForm, date: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        <input type="time" value={trainingForm.time} onChange={e => setTrainingForm({...trainingForm, time: e.target.value})} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                        <textarea placeholder="Anotações" value={trainingForm.notes} onChange={e => setTrainingForm({...trainingForm, notes: e.target.value})} rows={3} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none" />
                        <div className="flex gap-3">
                          <button onClick={() => setShowTrainingModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600">Cancelar</button>
                          <button onClick={startTraining} className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-500">Iniciar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingSessions.map((session) => (
                    <div key={session.id} className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{session.type}</h3>
                          <p className="text-gray-400 text-sm">{session.date} às {session.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'completed' ? 'bg-green-500/20 text-green-400' : session.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'}`}>
                          {session.status === 'completed' ? 'Finalizado' : 'Em andamento'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setLiveTraining(session); setActions([]); setTimerRunning(true); }} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-sm py-2 rounded-xl transition-colors">
                          {session.status === 'completed' ? 'Ver Scout' : 'Iniciar Scout'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {trainingSessions.length === 0 && (
                    <div className="col-span-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center text-gray-500">
                      Nenhum treino cadastrado
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Calendário</h2>
                <p className="text-gray-400">Partidas e treinos agendados</p>
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Dom</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Seg</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Ter</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Qua</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Qui</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Sex</div>
                <div className="text-center text-purple-400 text-sm font-semibold py-2">Sáb</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2 + 1
                  const today = new Date().getDate()
                  const isToday = day === today
                  const matchesDay = matches.filter(m => m.date && new Date(m.date).getDate() === day)
                  const trainingDay = trainingSessions.filter(t => t.date && new Date(t.date).getDate() === day)
                  const hasEvent = matchesDay.length > 0 || trainingDay.length > 0
                  const isCurrentMonth = day > 0 && day <= 31
                  
                  if (!isCurrentMonth) {
                    return <div key={i} className="aspect-square"></div>
                  }
                  
                  return (
                    <div key={i} className={`aspect-square rounded-lg p-1 ${isToday ? 'bg-purple-600/30 border border-purple-500' : hasEvent ? 'bg-gray-700/50' : 'bg-gray-900/30'} transition-colors`}>
                      <span className={`text-sm ${isToday ? 'text-purple-300 font-bold' : 'text-gray-400'}`}>{day}</span>
                      <div className="mt-1 space-y-1">
                        {matchesDay.slice(0, 2).map(m => (
                          <div key={m.id} className="text-xs text-green-400 truncate">🏐 {m.opponent}</div>
                        ))}
                        {trainingDay.slice(0, 1).map(t => (
                          <div key={t.id} className="text-xs text-blue-400 truncate">💪 {t.type}</div>
                        ))}
                        {matchesDay.length > 2 && (
                          <div className="text-xs text-gray-500">+{matchesDay.length - 2} mais</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Próximas Partidas</h3>
                <div className="space-y-3">
                  {matches.filter(m => m.status !== 'completed').map(match => (
                    <div key={match.id} className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">🏐 {match.opponent}</p>
                          <p className="text-gray-400 text-sm">{match.date} às {match.time}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Agendada</span>
                      </div>
                    </div>
                  ))}
                  {matches.filter(m => m.status !== 'completed').length === 0 && (
                    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 text-center text-gray-500">
                      Nenhuma partida agendada
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Próximos Treinos</h3>
                <div className="space-y-3">
                  {trainingSessions.filter(t => t.status !== 'completed').map(session => (
                    <div key={session.id} className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">💪 {session.type}</p>
                          <p className="text-gray-400 text-sm">{session.date} às {session.time}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Agendado</span>
                      </div>
                    </div>
                  ))}
                  {trainingSessions.filter(t => t.status !== 'completed').length === 0 && (
                    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 text-center text-gray-500">
                      Nenhum treino agendado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Estatísticas</h2>
                <p className="text-gray-400">Análise detalhada dos jogadores</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportPlayerStatsCSV} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20">
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
                <ExportPDFButton type="stats" teamName={team.name} coach={team.coach} players={players} />
                {selectedStatPlayer && (
                  <ExportPDFButton type="player" teamName={team.name} coach={team.coach} players={players} player={selectedStatPlayer} />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Selecione um Jogador</label>
              <select value={selectedStatPlayer?.id || ''} onChange={(e) => setSelectedStatPlayer(players.find(p => p.id === Number(e.target.value)))} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                <option value="">Selecione...</option>
                {players.sort((a, b) => Number(a.number) - Number(b.number)).map(player => (
                  <option key={player.id} value={player.id}>#{player.number} - {player.name}</option>
                ))}
              </select>
            </div>
            
            {selectedStatPlayer && (() => {
              const stats = getPlayerStats(selectedStatPlayer.id)
              const attackEff = stats.attack > 0 ? ((stats.attackPoints / stats.attack) * 100).toFixed(1) : 0
              const blockEff = stats.block > 0 ? ((stats.blockPoints / stats.block) * 100).toFixed(1) : 0
              const serveAceRate = stats.serve > 0 ? ((stats.serveAces / stats.serve) * 100).toFixed(1) : 0
              const defEff = stats.defense > 0 ? ((stats.defenseSuccess / stats.defense) * 100).toFixed(1) : 0
              const recvExcelence = stats.reception > 0 ? (((stats.receptionPerfect + stats.receptionGood) / stats.reception) * 100).toFixed(1) : 0
              const setQuality = stats.set > 0 ? (((stats.setPerfect) / stats.set) * 100).toFixed(1) : 0
              
              return (
                <div className="space-y-6">
                  <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-2xl font-bold text-white">#{selectedStatPlayer.number}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedStatPlayer.name}</h3>
                        <p className="text-purple-400">{selectedStatPlayer.position} • {selectedStatPlayer.height}m</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.attack}</p>
                        <p className="text-xs text-gray-400">Ataques</p>
                        <p className="text-xs text-green-400 mt-1">{stats.attackPoints} pontos</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${attackEff}%` }} />
                        </div>
                        <p className="text-xs text-purple-400 mt-1">{attackEff}% ef.</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.block}</p>
                        <p className="text-xs text-gray-400">Bloqueios</p>
                        <p className="text-xs text-green-400 mt-1">{stats.blockPoints} pontos</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${blockEff}%` }} />
                        </div>
                        <p className="text-xs text-green-400 mt-1">{blockEff}% ef.</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.serve}</p>
                        <p className="text-xs text-gray-400">Saques</p>
                        <p className="text-xs text-green-400 mt-1">{stats.serveAces} aces</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${serveAceRate}%` }} />
                        </div>
                        <p className="text-xs text-blue-400 mt-1">{serveAceRate}% ace</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.defense}</p>
                        <p className="text-xs text-gray-400">Defesas</p>
                        <p className="text-xs text-green-400 mt-1">{stats.defenseSuccess} sucesso</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${defEff}%` }} />
                        </div>
                        <p className="text-xs text-yellow-400 mt-1">{defEff}% ef.</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.reception}</p>
                        <p className="text-xs text-gray-400">Recepções</p>
                        <p className="text-xs text-green-400 mt-1">{stats.receptionPerfect} perfeitas</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${recvExcelence}%` }} />
                        </div>
                        <p className="text-xs text-pink-400 mt-1">{recvExcelence}% exc.</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{stats.set}</p>
                        <p className="text-xs text-gray-400">Levantamentos</p>
                        <p className="text-xs text-green-400 mt-1">{stats.setPerfect} perfeitos</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${setQuality}%` }} />
                        </div>
                        <p className="text-xs text-cyan-400 mt-1">{setQuality}% qual.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-purple-400 text-xs font-semibold uppercase">Categoria</th>
                          <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Total</th>
                          <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Positivo</th>
                          <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Negativo</th>
                          <th className="px-4 py-3 text-center text-purple-400 text-xs font-semibold uppercase">Eficiência</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">⚡ Ataque</td>
                          <td className="px-4 py-3 text-center text-white">{stats.attack}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.attackPoints}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.attackErrors}</td>
                          <td className="px-4 py-3 text-center text-purple-400">{attackEff}%</td>
                        </tr>
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">🛡️ Bloqueio</td>
                          <td className="px-4 py-3 text-center text-white">{stats.block}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.blockPoints}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.blockErrors}</td>
                          <td className="px-4 py-3 text-center text-purple-400">{blockEff}%</td>
                        </tr>
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">🎾 Saque</td>
                          <td className="px-4 py-3 text-center text-white">{stats.serve}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.serveAces}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.serveErrors}</td>
                          <td className="px-4 py-3 text-center text-purple-400">Ace: {serveAceRate}%</td>
                        </tr>
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">👐 Defesa</td>
                          <td className="px-4 py-3 text-center text-white">{stats.defense}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.defenseSuccess}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.defenseErrors}</td>
                          <td className="px-4 py-3 text-center text-purple-400">{defEff}%</td>
                        </tr>
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">🤲 Recepção</td>
                          <td className="px-4 py-3 text-center text-white">{stats.reception}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.receptionPerfect + stats.receptionGood}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.receptionErrors}</td>
                          <td className="px-4 py-3 text-center text-purple-400">{recvExcelence}%</td>
                        </tr>
                        <tr className="hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-white">💨 Levantamento</td>
                          <td className="px-4 py-3 text-center text-white">{stats.set}</td>
                          <td className="px-4 py-3 text-center text-green-400">{stats.setPerfect}</td>
                          <td className="px-4 py-3 text-center text-red-400">{stats.setBad}</td>
                          <td className="px-4 py-3 text-center text-purple-400">{setQuality}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
        
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Comparação de Jogadores</h2>
              <p className="text-gray-400">Compare estatísticas entre jogadores</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Jogador 1</label>
                <select value={comparePlayers.player1?.id || ''} onChange={(e) => setComparePlayers({ ...comparePlayers, player1: players.find(p => p.id === Number(e.target.value)) })} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                  <option value="">Selecione...</option>
                  {players.sort((a, b) => Number(a.number) - Number(b.number)).map(player => (
                    <option key={player.id} value={player.id}>#{player.number} - {player.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Jogador 2</label>
                <select value={comparePlayers.player2?.id || ''} onChange={(e) => setComparePlayers({ ...comparePlayers, player2: players.find(p => p.id === Number(e.target.value)) })} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none">
                  <option value="">Selecione...</option>
                  {players.sort((a, b) => Number(a.number) - Number(b.number)).map(player => (
                    <option key={player.id} value={player.id}>#{player.number} - {player.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {comparePlayers.player1 && comparePlayers.player2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <span className="text-lg font-bold text-white">#{comparePlayers.player1.number}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{comparePlayers.player1.name}</h3>
                      <p className="text-purple-400 text-sm">{comparePlayers.player1.position}</p>
                    </div>
                  </div>
                  {(() => {
                    const stats = getPlayerStats(comparePlayers.player1.id)
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Ataque</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.attack > 0 ? (stats.attackPoints / stats.attack) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.attack} ({stats.attackPoints} pts)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Bloqueio</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.block > 0 ? (stats.blockPoints / stats.block) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.block} ({stats.blockPoints} pts)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Saque</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.serve > 0 ? (stats.serveAces / stats.serve) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.serve} ({stats.serveAces} aces)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Defesa</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.defense > 0 ? (stats.defenseSuccess / stats.defense) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.defense} ({stats.defenseSuccess} ✓)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Recepção</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${stats.reception > 0 ? ((stats.receptionPerfect + stats.receptionGood) / stats.reception) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.reception} ({stats.receptionPerfect} perf)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Levantamento</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${stats.set > 0 ? (stats.setPerfect / stats.set) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.set} ({stats.setPerfect} perf)</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
                
                <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <span className="text-lg font-bold text-white">#{comparePlayers.player2.number}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{comparePlayers.player2.name}</h3>
                      <p className="text-blue-400 text-sm">{comparePlayers.player2.position}</p>
                    </div>
                  </div>
                  {(() => {
                    const stats = getPlayerStats(comparePlayers.player2.id)
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Ataque</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.attack > 0 ? (stats.attackPoints / stats.attack) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.attack} ({stats.attackPoints} pts)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Bloqueio</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.block > 0 ? (stats.blockPoints / stats.block) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.block} ({stats.blockPoints} pts)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Saque</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.serve > 0 ? (stats.serveAces / stats.serve) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.serve} ({stats.serveAces} aces)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Defesa</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${stats.defense > 0 ? (stats.defenseSuccess / stats.defense) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.defense} ({stats.defenseSuccess} ✓)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Recepção</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${stats.reception > 0 ? ((stats.receptionPerfect + stats.receptionGood) / stats.reception) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.reception} ({stats.receptionPerfect} perf)</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Levantamento</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${stats.set > 0 ? (stats.setPerfect / stats.set) * 100 : 0}%` }} />
                            </div>
                            <span className="text-white text-sm">{stats.set} ({stats.setPerfect} perf)</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Modais de Notas de Pós-Partida */}
        {showNotesView && selectedNoteForView && (
          <PostGameNotesView
            isOpen={showNotesView}
            onClose={() => setShowNotesView(false)}
            note={selectedNoteForView}
            onEdit={handleEditPostGameNote}
          />
        )}
        
        {showNotesModal && selectedMatchForNotes && (
          <PostGameNotesForm
            isOpen={showNotesModal}
            onClose={() => {
              setShowNotesModal(false)
              setEditingPostGameNote(null)
            }}
            onSave={handleSavePostGameNote}
            players={players}
            matchId={selectedMatchForNotes.id}
            matchDate={selectedMatchForNotes.date}
            teamStats={getTeamStatsForMatch(selectedMatchForNotes)}
            existingNotes={editingPostGameNote}
          />
        )}
      </main>
    </div>
  )
}