import { Vector3 } from '@babylonjs/core'

export interface MoveData {
  name: string
  type: 'light' | 'special' | 'smash' | 'tilt' | 'aerial' | 'grab'
  startupFrames: number
  activeFrames: number
  recoveryFrames: number
  damage: number
  baseKnockback: Vector3
  knockbackAngle: number
  hitboxSize: Vector3
  hitboxOffset: Vector3
}

export interface FighterStats {
  weight: number
  speed: number
  jumpHeight: number
  airSpeed: number
  fallSpeed: number
  dashSpeed: number
  shieldSize: number
  parryWindow: number
}

export interface FighterData {
  id: string
  name: string
  description: string
  archetype: string
  stats: FighterStats
  moves: Record<string, MoveData>
  modelPath: string
  texturePath?: string
  animationPaths: Record<string, string>
  voicePaths: Record<string, string>
  uniqueNotes?: string
}

export interface FighterState {
  playerId: number
  damage: number
  stocks: number
  position: Vector3
  velocity: Vector3
  facing: 'left' | 'right'
  currentMove?: string
  frameData: {
    currentFrame: number
    totalFrames: number
    canCancel: boolean
    invulnerable: boolean
  }
  status: 'idle' | 'moving' | 'attacking' | 'stunned' | 'shielding' | 'dodging' | 'falling'
}