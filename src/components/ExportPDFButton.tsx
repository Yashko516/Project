import { Download, FileText, User, Trophy } from 'lucide-react'
import { Match, Player } from '../types'
import { PDFReportGenerator } from './PDFReportGenerator'
import { useState } from 'react'

interface ExportPDFButtonProps {
  type: 'team' | 'match' | 'stats' | 'player'
  teamName: string
  coach: string
  players: Player[]
  match?: Match
  player?: Player
}

export function ExportPDFButton({ 
  type, 
  teamName, 
  coach, 
  players, 
  match,
  player 
}: ExportPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async () => {
    setIsGenerating(true)
    
    try {
      const generator = new PDFReportGenerator()
      const data = {
        teamName,
        coach,
        match,
        players,
        date: new Date().toLocaleDateString('pt-BR')
      }

      switch (type) {
        case 'team':
          generator.generateTeamReport(data)
          break
        case 'match':
          generator.generateMatchReport(data)
          break
        case 'stats':
          generator.generateStatsReport(data)
          break
        case 'player':
          if (player) {
            generator.generatePlayerReport(player, teamName, coach)
          }
          break
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'team':
        return <Trophy className="w-5 h-5" />
      case 'match':
        return <FileText className="w-5 h-5" />
      case 'stats':
        return <Trophy className="w-5 h-5" />
      case 'player':
        return <User className="w-5 h-5" />
    }
  }

  const getLabel = () => {
    switch (type) {
      case 'team':
        return 'Equipe'
      case 'match':
        return 'Partida'
      case 'stats':
        return 'Estatísticas'
      case 'player':
        return 'Jogador'
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200
        ${isGenerating 
          ? 'bg-gray-600 cursor-not-allowed opacity-70' 
          : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95'
        }
      `}
    >
      {getIcon()}
      <Download className="w-5 h-5" />
      <span className="text-white font-medium">
        {isGenerating ? 'Gerando...' : `PDF ${getLabel()}`}
      </span>
    </button>
  )
}