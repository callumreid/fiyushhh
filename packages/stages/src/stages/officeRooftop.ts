import { Vector3 } from '@babylonjs/core'
import { StageData } from '../types'

export const officeRooftop: StageData = {
  id: 'office-rooftop',
  name: 'Office Rooftop',
  description: 'Flat stage with sunset backdrop - Final Destination style',
  layout: 'Flat',
  theme: 'Office Rooftop sunset',
  platforms: [
    {
      id: 'main-platform',
      position: new Vector3(0, 0, 0),
      size: new Vector3(40, 2, 10),
      isMoving: false,
      isPassThrough: false
    }
  ],
  blastZones: {
    left: -45,
    right: 45,
    top: 30,
    bottom: -20
  },
  spawnPoints: [
    { position: new Vector3(-15, 3, 0), playerId: 0 },
    { position: new Vector3(-5, 3, 0), playerId: 1 },
    { position: new Vector3(5, 3, 0), playerId: 2 },
    { position: new Vector3(15, 3, 0), playerId: 3 }
  ],
  backgroundPath: '/assets/stages/office-rooftop/background.jpg',
  musicPath: '/assets/stages/office-rooftop/sunset-ambient.ogg',
  lightingConfig: {
    ambient: {
      color: new Vector3(0.8, 0.6, 0.4), // Warm sunset light
      intensity: 0.6
    },
    directional: {
      direction: new Vector3(-0.5, -1, -0.2),
      color: new Vector3(1.0, 0.8, 0.6),
      intensity: 0.8
    }
  }
}