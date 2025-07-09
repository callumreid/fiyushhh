import { Vector3 } from '@babylonjs/core'
import { StageData } from '../types'

export const gameShowSet: StageData = {
  id: 'game-show-set',
  name: 'Game Show Set',
  description: 'Classic tri-platform layout with bright stage lights',
  layout: 'Classic tri-plat',
  theme: 'Game-Show Set lights',
  platforms: [
    {
      id: 'main-platform',
      position: new Vector3(0, 0, 0),
      size: new Vector3(35, 2, 10),
      isMoving: false,
      isPassThrough: false
    },
    {
      id: 'left-platform',
      position: new Vector3(-12, 8, 0),
      size: new Vector3(8, 1, 8),
      isMoving: false,
      isPassThrough: true
    },
    {
      id: 'right-platform',
      position: new Vector3(12, 8, 0),
      size: new Vector3(8, 1, 8),
      isMoving: false,
      isPassThrough: true
    },
    {
      id: 'top-platform',
      position: new Vector3(0, 16, 0),
      size: new Vector3(10, 1, 8),
      isMoving: false,
      isPassThrough: true
    }
  ],
  blastZones: {
    left: -47,
    right: 47,
    top: 32,
    bottom: -22
  },
  spawnPoints: [
    { position: new Vector3(-16, 3, 0), playerId: 0 },
    { position: new Vector3(-6, 3, 0), playerId: 1 },
    { position: new Vector3(6, 3, 0), playerId: 2 },
    { position: new Vector3(16, 3, 0), playerId: 3 }
  ],
  backgroundPath: '/assets/stages/game-show-set/background.jpg',
  musicPath: '/assets/stages/game-show-set/show-theme.ogg',
  lightingConfig: {
    ambient: {
      color: new Vector3(0.9, 0.9, 1.0), // Bright white stage lights
      intensity: 0.8
    },
    directional: {
      direction: new Vector3(0, -1, 0),
      color: new Vector3(1.0, 1.0, 1.0),
      intensity: 1.0
    }
  }
}