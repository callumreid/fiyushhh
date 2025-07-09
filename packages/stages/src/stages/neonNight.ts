import { Vector3 } from '@babylonjs/core'
import { StageData } from '../types'

export const neonNight: StageData = {
  id: 'neon-night',
  name: 'Neon Night',
  description: 'Tall center platform with cyberpunk skyline backdrop',
  layout: 'Tall center',
  theme: 'Neon Night skyline',
  platforms: [
    {
      id: 'main-platform',
      position: new Vector3(0, 0, 0),
      size: new Vector3(32, 2, 10),
      isMoving: false,
      isPassThrough: false
    },
    {
      id: 'center-tower',
      position: new Vector3(0, 12, 0),
      size: new Vector3(6, 1, 8),
      isMoving: false,
      isPassThrough: true
    }
  ],
  blastZones: {
    left: -42,
    right: 42,
    top: 29,
    bottom: -19
  },
  spawnPoints: [
    { position: new Vector3(-12, 3, 0), playerId: 0 },
    { position: new Vector3(-4, 3, 0), playerId: 1 },
    { position: new Vector3(4, 3, 0), playerId: 2 },
    { position: new Vector3(12, 3, 0), playerId: 3 }
  ],
  backgroundPath: '/assets/stages/neon-night/background.jpg',
  musicPath: '/assets/stages/neon-night/cyberpunk-beat.ogg',
  lightingConfig: {
    ambient: {
      color: new Vector3(0.2, 0.4, 0.8), // Cool blue neon
      intensity: 0.4
    },
    directional: {
      direction: new Vector3(0.2, -1, -0.3),
      color: new Vector3(0.6, 0.2, 1.0), // Purple accent
      intensity: 0.6
    }
  }
}