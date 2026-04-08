import jsPDF from 'jspdf'
import { Match, Player } from '../types'

interface PDFReportData {
  teamName: string
  coach: string
  match?: Match
  players: Player[]
  date?: string
}

export class PDFReportGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  // Adicionar cabeçalho principal
  private addHeader(title: string, subtitle: string = '') {
    // Fundo roxo
    this.doc.setFillColor(139, 92, 246) // #8B5CF6
    this.doc.rect(0, 0, 210, 40, 'F')
    
    // Título em branco
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(24)
    this.doc.text(title, 105, 25, { align: 'center' })
    
    if (subtitle) {
      this.doc.setFontSize(12)
      this.doc.text(subtitle, 105, 35, { align: 'center' })
    }
    
    this.doc.setTextColor(0, 0, 0)
    this.doc.setDrawColor(139, 92, 246)
    this.doc.line(0, 40, 210, 40)
  }

  // Adicionar seção com título
  private addSection(title: string, y: number) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(139, 92, 246)
    this.doc.text(title, 15, y)
    
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(15, y + 2, 195, y + 2)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(0, 0, 0)
    
    return y + 10
  }

  // Adicionar tabela simples
  private addTable(headers: string[], data: string[][], y: number, colWidths: number[]) {
    const startX = 15
    const rowHeight = 8
    const tableWidth = colWidths.reduce((a, b) => a + b, 0)
    
    // Cabeçalho
    this.doc.setFillColor(139, 92, 246)
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont('helvetica', 'bold')
    
    let xPos = startX
    headers.forEach((header, i) => {
      this.doc.rect(xPos, y, colWidths[i], rowHeight, 'F')
      this.doc.text(header, xPos + colWidths[i] / 2, y + 5, { align: 'center' })
      xPos += colWidths[i]
    })
    
    // Linhas
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(0, 0, 0)
    
    data.forEach((row, i) => {
      xPos = startX
      row.forEach((cell, j) => {
        this.doc.setDrawColor(220, 220, 220)
        this.doc.rect(xPos, y + (i + 1) * rowHeight, colWidths[j], rowHeight)
        this.doc.text(cell.substring(0, 20), xPos + 2, y + (i + 1) * rowHeight + 5)
        xPos += colWidths[j]
      })
    })
    
    return y + (data.length + 1) * rowHeight + 10
  }

  // Adicionar barras de progresso horizontal
  private addBarChart(label: string, value: number, max: number, y: number) {
    const barWidth = 100
    const barHeight = 8
    const fillWidth = (value / max) * barWidth
    
    // Label
    this.doc.setFontSize(10)
    this.doc.text(`${label}: ${value.toFixed(1)}%`, 15, y)
    
    // Barra vazia
    this.doc.setDrawColor(200, 200, 200)
    this.doc.rect(80, y - 5, barWidth, barHeight)
    
    // Barra preenchida com roxo
    this.doc.setFillColor(139, 92, 246)
    this.doc.rect(80, y - 5, fillWidth, barHeight, 'F')
    
    return y + 12
  }

  // Gerenciar nova página
  private checkAndAddPage(y: number) {
    if (y > 270) {
      this.doc.addPage()
      return 20
    }
    return y
  }

  // Gerar relatório de equipe
  generateTeamReport(data: PDFReportData): void {
    this.addHeader('Relatório da Equipe', data.teamName)
    
    let y = 55
    
    // Informações da equipe
    y = this.addSection('Informações da Equipe', y)
    this.doc.text(`Equipe: ${data.teamName}`, 20, y)
    this.doc.text(`Técnico: ${data.coach}`, 20, y + 8)
    this.doc.text(`Total de Jogadores: ${data.players.length}`, 20, y + 16)
    
    y = y + 28
    y = this.checkAndAddPage(y)
    
    // Lista de jogadores
    y = this.addSection('Jogadores', y)
    const headers = ['#', 'Nome', 'Posição', 'Altura']
    const playerData = data.players.map(p => [
      p.number.toString(),
      p.name,
      p.position,
      `${p.height}m`
    ])
    
    y = this.addTable(headers, playerData, y, [15, 60, 40, 35])
    
    // Salvar
    this.doc.save(`${data.teamName}_relatorio_equipe.pdf`)
  }

  // Gerar relatório de partida
  generateMatchReport(data: PDFReportData): void {
    if (!data.match) {
      console.error('No match data provided')
      return
    }

    const match = data.match
    
    this.addHeader('Relatório de Partida', `${data.teamName} vs ${match.opponent}`)
    
    let y = 55
    
    // Informações da partida
    y = this.addSection('Informações da Partida', y)
    this.doc.text(`Adversário: ${match.opponent}`, 20, y)
    this.doc.text(`Data: ${match.date}`, 20, y + 8)
    this.doc.text(`Placar Final: ${match.teamScore} - ${match.opponentScore}`, 20, y + 16)
    this.doc.text(`Total de Ações: ${match.actions.length}`, 20, y + 24)
    
    y = y + 36
    y = this.checkAndAddPage(y)
    
    // Estatísticas por jogador
    y = this.addSection('Estatísticas por Jogador', y)
    
    data.players.forEach(player => {
      if (!player.matchesStats) return
      
      const playerStats = player.matchesStats.filter(
        s => s.matchId === match.id
      )[0]
      
      if (!playerStats) return
      
      y = this.checkAndAddPage(y)
      
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(139, 92, 246)
      this.doc.text(`#${player.number} - ${player.name} (${player.position})`, 15, y)
      
      this.doc.setFontSize(9)
      this.doc.setTextColor(0, 0, 0)
      y += 8
      
      // Ataque
      const attackTotal = playerStats.attack.points + playerStats.attack.errors
      const attackEff = attackTotal > 0 ? (playerStats.attack.points / attackTotal) * 100 : 0
      y = this.addBarChart('Eficiência de Ataque', attackEff, 100, y)
      
      // Bloqueio
      const blockTotal = playerStats.block.points + playerStats.block.errors
      const blockEff = blockTotal > 0 ? (playerStats.block.points / blockTotal) * 100 : 0
      y = this.addBarChart('Eficiência de Bloqueio', blockEff, 100, y)
      
      // Saque
      const serveTotal = playerStats.serve.aces + playerStats.serve.success + playerStats.serve.errors
      const aceRate = serveTotal > 0 ? (playerStats.serve.aces / serveTotal) * 100 : 0
      y = this.addBarChart('Taxa de Ace', aceRate, 50, y)
      
      // Recepção
      const receiveTotal = playerStats.reception.perfect + playerStats.reception.good + playerStats.reception.errors
      const receiveExcel = receiveTotal > 0 ? (playerStats.reception.perfect / receiveTotal) * 100 : 0
      y = this.addBarChart('Excelência de Recepção', receiveExcel, 100, y)
      
      // Levantamento
      const setTotal = playerStats.set.perfect + playerStats.set.regular + playerStats.set.poor
      const setQual = setTotal > 0 ? (playerStats.set.perfect / setTotal) * 100 : 0
      y = this.addBarChart('Qualidade de Levantamento', setQual, 100, y)
      
      y += 5
    })
    
    // Resumo dos sets
    y = this.checkAndAddPage(y)
    y = this.addSection('Resumo por Set', y)
    
    match.sets.forEach((set, i) => {
      const teamWin = set.teamScore >= 25
      const color = teamWin ? [16, 185, 129] : [239, 68, 68]
      this.doc.setFontSize(10)
      this.doc.setTextColor(color[0], color[1], color[2])
      this.doc.text(`Set ${i + 1}: ${set.teamScore} - ${set.opponentScore} ${teamWin ? '(V)' : '(D)'}`, 20, y)
      this.doc.setTextColor(0, 0, 0)
      y += 6
    })
    
    y = this.checkAndAddPage(y)
    
    // Footer
    y = this.checkAndAddPage(y)
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    this.doc.text('Relatório gerado pelo Scout de Voleibol', 105, 285, { align: 'center' })
    
    // Salvar
    const fileName = `${data.teamName}_vs_${match.opponent}_${match.date}.pdf`
    this.doc.save(fileName)
  }

  // Gerar relatório de estatísticas gerais
  generateStatsReport(data: PDFReportData): void {
    this.addHeader('Relatório Estatístico Geral', data.teamName)
    
    let y = 55
    
    // Resumo total de ações
    let totalActions = 0
    let totalPoints = 0
    let totalErrors = 0
    
    data.players.forEach(player => {
      if (player.matchesStats) {
        player.matchesStats.forEach(stats => {
          totalActions += 
            stats.attack.points + stats.attack.errors +
            stats.block.points + stats.block.errors +
            stats.serve.aces + stats.serve.success + stats.serve.errors +
            stats.defense.success + stats.defense.errors +
            stats.reception.perfect + stats.reception.good + stats.reception.errors +
            stats.set.perfect + stats.set.regular + stats.set.poor
          totalPoints +=
            stats.attack.points + stats.block.points + stats.serve.aces
          totalErrors +=
            stats.attack.errors + stats.block.errors + stats.serve.errors +
            stats.defense.errors + stats.reception.errors
        })
      }
    })
    
    y = this.addSection('Resumo Geral', y)
    this.doc.text(`Total de Ações: ${totalActions}`, 20, y)
    this.doc.text(`Total de Pontos: ${totalPoints}`, 20, y + 8)
    this.doc.text(`Total de Erros: ${totalErrors}`, 20, y + 16)
    this.doc.text(`Taxa de Sucesso: ${((totalPoints / totalActions) * 100).toFixed(1)}%`, 20, y + 24)
    
    y = y + 36
    y = this.checkAndAddPage(y)
    
    // Top performers
    y = this.addSection('Melhores em Cada Categoria', y)
    
    // Melhor Atacante
    let bestAttacker: { name: string; number: number; points: number } | null = null
    let maxAttackPoints = 0
    
    data.players.forEach(player => {
      if (player.matchesStats) {
        const totalPoints = player.matchesStats.reduce((sum, s) => sum + s.attack.points, 0)
        if (totalPoints > maxAttackPoints) {
          maxAttackPoints = totalPoints
          bestAttacker = { name: player.name, number: player.number, points: totalPoints }
        }
      }
    })
    
    if (bestAttacker) {
      this.doc.setFontSize(10)
      this.doc.setTextColor(139, 92, 246)
      this.doc.text(`⚡ Melhor Atacante: #${bestAttacker.number} ${bestAttacker.name} (${bestAttacker.points} pontos)`, 20, y)
      this.doc.setTextColor(0, 0, 0)
      y += 8
    }
    
    // Melhor Bloqueador
    let bestBlocker: { name: string; number: number; points: number } | null = null
    let maxBlockPoints = 0
    
    data.players.forEach(player => {
      if (player.matchesStats) {
        const totalPoints = player.matchesStats.reduce((sum, s) => sum + s.block.points, 0)
        if (totalPoints > maxBlockPoints) {
          maxBlockPoints = totalPoints
          bestBlocker = { name: player.name, number: player.number, points: totalPoints }
        }
      }
    })
    
    if (bestBlocker) {
      this.doc.setTextColor(139, 92, 246)
      this.doc.text(`🛡️ Melhor Bloqueador: #${bestBlocker.number} ${bestBlocker.name} (${bestBlocker.points} pontos)`, 20, y)
      this.doc.setTextColor(0, 0, 0)
      y += 8
    }
    
    // Melhor Sacador
    let bestServer: { name: string; number: number; aces: number } | null = null
    let maxAces = 0
    
    data.players.forEach(player => {
      if (player.matchesStats) {
        const totalAces = player.matchesStats.reduce((sum, s) => sum + s.serve.aces, 0)
        if (totalAces > maxAces) {
          maxAces = totalAces
          bestServer = { name: player.name, number: player.number, aces: totalAces }
        }
      }
    })
    
    if (bestServer) {
      this.doc.setTextColor(139, 92, 246)
      this.doc.text(`🎾 Melhor Sacador: #${bestServer.number} ${bestServer.name} (${bestServer.aces} aces)`, 20, y)
      this.doc.setTextColor(0, 0, 0)
    }
    
    // Footer
    y = this.checkAndAddPage(y)
    y = this.checkAndAddPage(y)
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    this.doc.text('Relatório gerado pelo Scout de Voleibol', 105, 285, { align: 'center' })
    
    // Salvar
    this.doc.save(`${data.teamName}_relatorio_estatistico.pdf`)
  }

  // Gerar relatório individual de jogador
  generatePlayerReport(player: Player, teamName: string, coach: string): void {
    this.addHeader('Relatório Individual do Jogador', player.name)
    
    let y = 55
    
    // Informações do jogador
    y = this.addSection('Informações Pessoais', y)
    this.doc.text(`Nome: ${player.name}`, 20, y)
    this.doc.text(`Número: ${player.number}`, 20, y + 8)
    this.doc.text(`Posição: ${player.position}`, 20, y + 16)
    this.doc.text(`Altura: ${player.height}m`, 20, y + 24)
    this.doc.text(`Status: ${player.isStarter ? 'Titular' : 'Reserva'}`, 20, y + 32)
    
    y = y + 42
    y = this.checkAndAddPage(y)
    
    // Estatísticas por partida
    if (player.matchesStats && player.matchesStats.length > 0) {
      y = this.addSection('Estatísticas por Partida', y)
      
      const headers = ['Data', 'AÇ', 'BLO', 'SAQ', 'DEF', 'REC', 'LEV']
      const matchData = player.matchesStats.map(stats => {
        const matchDate = stats.date || 'N/A'
        return [
          matchDate,
          `${stats.attack.points}A/${stats.attack.errors}E`,
          `${stats.block.points}A/${stats.block.errors}E`,
          `${stats.serve.aces}A/${stats.serve.errors}E`,
          `${stats.defense.success}S/${stats.defense.errors}E`,
          `${stats.reception.perfect}P/${stats.reception.good}B`,
          `${stats.set.perfect}P/${stats.set.regular}R`
        ]
      })
      
      y = this.addTable(headers, matchData, y, [30, 30, 30, 30, 30, 30, 20])
      
      y = this.checkAndAddPage(y)
      
      // Total geral
      const totalAttackPoints = player.matchesStats.reduce((sum, s) => sum + s.attack.points, 0)
      const totalAttackErrors = player.matchesStats.reduce((sum, s) => sum + s.attack.errors, 0)
      const totalBlockPoints = player.matchesStats.reduce((sum, s) => sum + s.block.points, 0)
      const totalAces = player.matchesStats.reduce((sum, s) => sum + s.serve.aces, 0)
      const totalDefense = player.matchesStats.reduce((sum, s) => sum + s.defense.success, 0)
      const totalReceptionPerfect = player.matchesStats.reduce((sum, s) => sum + s.reception.perfect, 0)
      const totalSetPerfect = player.matchesStats.reduce((sum, s) => sum + s.set.perfect, 0)
      
      y = this.addSection('Totais Gerais', y)
      this.doc.text(`Pontos de Ataque: ${totalAttackPoints}`, 20, y)
      this.doc.text(`Pontos de Bloqueio: ${totalBlockPoints}`, 20, y + 8)
      this.doc.text(`Aces de Saque: ${totalAces}`, 20, y + 16)
      this.doc.text(`Defesas Sucesso: ${totalDefense}`, 20, y + 24)
      this.doc.text(`Recepções Perfeitas: ${totalReceptionPerfect}`, 20, y + 32)
      this.doc.text(`Levantamentos Perfeitos: ${totalSetPerfect}`, 20, y + 40)
    }
    
    // Footer
    y = this.checkAndAddPage(y)
    y = this.checkAndAddPage(y)
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    this.doc.text(`Equipe: ${teamName} | Técnico: ${coach}`, 105, 285, { align: 'center' })
    
    // Salvar
    this.doc.save(`${player.name}_relatorio_individual.pdf`)
  }
}

export default PDFReportGenerator