import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const angryTurkey: FighterData = {
  id: 'angry-turkey',
  name: 'Angry Turkey',
  description: 'Speedy glass-cannon with enhanced mobility',
  archetype: 'Speedy Glass-Cannon',
  stats: {
    weight: 75,
    speed: 12,
    jumpHeight: 15,
    airSpeed: 10,
    fallSpeed: 6 * 1.3, // Fast-fall bonus
    dashSpeed: 18,
    shieldSize: 0.7,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Peck Attack',
      type: 'light',
      startupFrames: 2,
      activeFrames: 2,
      recoveryFrames: 6,
      damage: 4,
      baseKnockback: new Vector3(2, 0.5, 0),
      knockbackAngle: 20,
      hitboxSize: new Vector3(1.2, 0.8, 1),
      hitboxOffset: new Vector3(1, 0.2, 0)
    },
    special: {
      name: 'Gobble Rush',
      type: 'special',
      startupFrames: 8,
      activeFrames: 10,
      recoveryFrames: 12,
      damage: 3, // Multi-hit
      baseKnockback: new Vector3(6, 2, 0),
      knockbackAngle: 30,
      hitboxSize: new Vector3(1.5, 1.2, 1),
      hitboxOffset: new Vector3(1.2, 0, 0)
    },
    smash: {
      name: 'Thanksgiving Fury',
      type: 'smash',
      startupFrames: 14,
      activeFrames: 4,
      recoveryFrames: 18,
      damage: 16,
      baseKnockback: new Vector3(11, 6, 0),
      knockbackAngle: 50,
      hitboxSize: new Vector3(2, 1.8, 1),
      hitboxOffset: new Vector3(1.5, 0, 0)
    },
    grab: {
      name: 'Talon Grab',
      type: 'grab',
      startupFrames: 5,
      activeFrames: 3,
      recoveryFrames: 12,
      damage: 6,
      baseKnockback: new Vector3(5, 3, 0),
      knockbackAngle: 65,
      hitboxSize: new Vector3(1.3, 1.3, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    }
  },
  modelPath: '/assets/fighters/angry-turkey/model.glb',
  animationPaths: {
    idle: '/assets/fighters/angry-turkey/idle.glb',
    walk: '/assets/fighters/angry-turkey/walk.glb',
    jump: '/assets/fighters/angry-turkey/jump.glb',
    attack: '/assets/fighters/angry-turkey/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/angry-turkey/gobble.ogg',
    ko: '/assets/fighters/angry-turkey/squawk.ogg'
  },
  uniqueNotes: 'Dash-dance accel bonus; fast-fall ×1.3'
}