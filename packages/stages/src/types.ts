import { Vector3 } from '@babylonjs/core'

export interface Platform {
  id: string
  position: Vector3
  size: Vector3
  isMoving?: boolean
  movementPath?: Vector3[]
  movementSpeed?: number
  isPassThrough?: boolean
}

export interface BlastZone {
  left: number
  right: number
  top: number
  bottom: number
}

export interface SpawnPoint {
  position: Vector3
  playerId?: number
}

export interface StageData {
  id: string
  name: string
  description: string
  layout: string
  theme: string
  platforms: Platform[]
  blastZones: BlastZone
  spawnPoints: SpawnPoint[]
  backgroundPath?: string
  musicPath?: string
  lightingConfig?: {
    ambient: { color: Vector3; intensity: number }
    directional?: { direction: Vector3; color: Vector3; intensity: number }
  }
}

export interface StageState {
  currentFrame: number
  movingPlatforms: Map<string, { currentTarget: number; progress: number }>
}