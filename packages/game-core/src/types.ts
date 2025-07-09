export enum GameStateType {
  MENU = 'MENU',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  STAGE_SELECT = 'STAGE_SELECT',
  MATCH = 'MATCH',
  RESULTS = 'RESULTS',
  PAUSE = 'PAUSE'
}

export interface Player {
  id: number
  characterId: string
  stocks: number
  damage: number
  inputDeviceId: string
  isConnected: boolean
}

export interface MatchSettings {
  maxPlayers: number
  stocks: number
  timeLimit?: number
  stageId: string
}

export interface GameStats {
  winner?: Player
  kos: Record<number, number>
  falls: Record<number, number>
  damageDealt: Record<number, number>
  matchDuration: number
}