import { Vector3 } from '@babylonjs/core'
import { StageData } from '../types'

export const birdClouds: StageData = {
  id: 'bird-clouds',
  name: 'Bird Clouds',
  description: 'Moving side platforms high in the sky during daytime',
  layout: 'Moving side',
  theme: 'Bird Clouds day',
  platforms: [
    {
      id: 'main-platform',
      position: new Vector3(0, 0, 0),
      size: new Vector3(36, 2, 10),
      isMoving: false,
      isPassThrough: false
    },
    {
      id: 'left-cloud',
      position: new Vector3(-15, 8, 0),
      size: new Vector3(10, 1, 8),
      isMoving: true,
      isPassThrough: true,
      movementPath: [
        new Vector3(-15, 8, 0),
        new Vector3(-25, 8, 0),
        new Vector3(-15, 8, 0),
        new Vector3(-5, 8, 0)
      ],
      movementSpeed: 20 // World units per second
    },
    {
      id: 'right-cloud',
      position: new Vector3(15, 8, 0),
      size: new Vector3(10, 1, 8),
      isMoving: true,
      isPassThrough: true,
      movementPath: [
        new Vector3(15, 8, 0),
        new Vector3(25, 8, 0),
        new Vector3(15, 8, 0),
        new Vector3(5, 8, 0)
      ],
      movementSpeed: 20 // World units per second
    }
  ],
  blastZones: {
    left: -45,
    right: 45,
    top: 31,
    bottom: -21
  },
  spawnPoints: [
    { position: new Vector3(-13, 3, 0), playerId: 0 },
    { position: new Vector3(-4, 3, 0), playerId: 1 },
    { position: new Vector3(4, 3, 0), playerId: 2 },
    { position: new Vector3(13, 3, 0), playerId: 3 }
  ],
  backgroundPath: '/assets/stages/bird-clouds/background.jpg',
  musicPath: '/assets/stages/bird-clouds/sky-breeze.ogg',
  lightingConfig: {
    ambient: {
      color: new Vector3(0.9, 0.9, 1.0), // Bright daylight
      intensity: 0.7
    },
    directional: {
      direction: new Vector3(-0.5, -1, 0.5),
      color: new Vector3(1.0, 1.0, 0.9),
      intensity: 0.9
    }
  }
}