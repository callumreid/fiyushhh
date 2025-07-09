import { GameStateType, Player, MatchSettings } from './types'

export class GameState {
  private currentState: GameStateType = GameStateType.MENU
  private players: Player[] = []
  private matchSettings: MatchSettings = {
    maxPlayers: 4,
    stocks: 3,
    stageId: 'office-rooftop'
  }

  getCurrentState(): GameStateType {
    return this.currentState
  }

  setState(newState: GameStateType): void {
    this.currentState = newState
  }

  getPlayers(): Player[] {
    return [...this.players]
  }

  addPlayer(characterId: string, inputDeviceId: string): boolean {
    if (this.players.length >= this.matchSettings.maxPlayers) {
      return false
    }

    const player: Player = {
      id: this.players.length,
      characterId,
      stocks: this.matchSettings.stocks,
      damage: 0,
      inputDeviceId,
      isConnected: true
    }

    this.players.push(player)
    return true
  }

  removePlayer(playerId: number): boolean {
    const index = this.players.findIndex(p => p.id === playerId)
    if (index === -1) return false

    this.players.splice(index, 1)
    return true
  }

  updatePlayerDamage(playerId: number, damage: number): void {
    const player = this.players.find(p => p.id === playerId)
    if (player) {
      player.damage = Math.max(0, damage)
    }
  }

  loseStock(playerId: number): boolean {
    const player = this.players.find(p => p.id === playerId)
    if (player && player.stocks > 0) {
      player.stocks--
      player.damage = 0
      return true
    }
    return false
  }

  getMatchSettings(): MatchSettings {
    return { ...this.matchSettings }
  }

  setStage(stageId: string): void {
    this.matchSettings.stageId = stageId
  }

  reset(): void {
    this.players = []
    this.currentState = GameStateType.MENU
    this.matchSettings = {
      maxPlayers: 4,
      stocks: 3,
      stageId: 'office-rooftop'
    }
  }
}