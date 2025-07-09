import { GameState } from './GameState'
import { GameStateType, GameStats, Player } from './types'

export class MatchManager {
  private gameState: GameState
  private matchStartTime: number = 0
  private stats: GameStats = {
    kos: {},
    falls: {},
    damageDealt: {},
    matchDuration: 0
  }

  constructor(gameState: GameState) {
    this.gameState = gameState
  }

  startMatch(): boolean {
    const players = this.gameState.getPlayers()
    if (players.length < 2) {
      return false
    }

    this.matchStartTime = Date.now()
    this.gameState.setState(GameStateType.MATCH)
    this.initializeStats(players)
    return true
  }

  handleKO(victimId: number, attackerId?: number): void {
    const victim = this.gameState.getPlayers().find(p => p.id === victimId)
    if (!victim) return

    // Lose stock
    const hasStocks = this.gameState.loseStock(victimId)
    
    // Update stats
    if (attackerId !== undefined) {
      this.stats.kos[attackerId] = (this.stats.kos[attackerId] || 0) + 1
    } else {
      this.stats.falls[victimId] = (this.stats.falls[victimId] || 0) + 1
    }

    // Check for match end
    this.checkMatchEnd()
  }

  handleDamage(victimId: number, attackerId: number, damage: number): void {
    const victim = this.gameState.getPlayers().find(p => p.id === victimId)
    if (!victim) return

    // Update damage
    this.gameState.updatePlayerDamage(victimId, victim.damage + damage)
    
    // Update stats
    this.stats.damageDealt[attackerId] = (this.stats.damageDealt[attackerId] || 0) + damage
  }

  private checkMatchEnd(): void {
    const players = this.gameState.getPlayers()
    const playersWithStocks = players.filter(p => p.stocks > 0)

    if (playersWithStocks.length <= 1) {
      this.endMatch(playersWithStocks[0])
    }
  }

  private endMatch(winner?: Player): void {
    this.stats.matchDuration = Date.now() - this.matchStartTime
    this.stats.winner = winner
    this.gameState.setState(GameStateType.RESULTS)
  }

  private initializeStats(players: Player[]): void {
    this.stats = {
      kos: {},
      falls: {},
      damageDealt: {},
      matchDuration: 0
    }

    players.forEach(player => {
      this.stats.kos[player.id] = 0
      this.stats.falls[player.id] = 0
      this.stats.damageDealt[player.id] = 0
    })
  }

  getStats(): GameStats {
    return { ...this.stats }
  }

  pause(): void {
    this.gameState.setState(GameStateType.PAUSE)
  }

  resume(): void {
    this.gameState.setState(GameStateType.MATCH)
  }
}