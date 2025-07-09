import { Vector3 } from '@babylonjs/core'
import { StageData } from '../types'

export const cowPasture: StageData = {
  id: 'cow-pasture',
  name: 'Cow Pasture',
  description: 'Dual side platforms with slanted terrain at dusk',
  layout: 'Dual side-plat',
  theme: 'Cow Pasture dusk',
  platforms: [
    {
      id: 'main-platform',
      position: new Vector3(0, 0, 0),
      size: new Vector3(38, 2, 10),
      isMoving: false,
      isPassThrough: false
    },
    {
      id: 'left-platform',
      position: new Vector3(-18, 6, 0),
      size: new Vector3(12, 1, 8),
      isMoving: false,
      isPassThrough: true
    },
    {
      id: 'right-platform',
      position: new Vector3(18, 6, 0),
      size: new Vector3(12, 1, 8),
      isMoving: false,
      isPassThrough: true
    }
  ],
  blastZones: {
    left: -44,
    right: 44,
    top: 30,
    bottom: -20
  },
  spawnPoints: [
    { position: new Vector3(-14, 3, 0), playerId: 0 },
    { position: new Vector3(-5, 3, 0), playerId: 1 },
    { position: new Vector3(5, 3, 0), playerId: 2 },
    { position: new Vector3(14, 3, 0), playerId: 3 }
  ],
  backgroundPath: '/assets/stages/cow-pasture/background.jpg',
  musicPath: '/assets/stages/cow-pasture/pastoral-dusk.ogg',
  lightingConfig: {
    ambient: {
      color: new Vector3(0.7, 0.5, 0.6), // Purple dusk light
      intensity: 0.5
    },
    directional: {
      direction: new Vector3(-0.3, -1, 0.2),
      color: new Vector3(0.9, 0.7, 0.8),
      intensity: 0.7
    }
  }
}