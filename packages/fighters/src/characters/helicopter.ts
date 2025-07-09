import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const helicopter: FighterData = {
  id: 'helicopter',
  name: 'Helicopter',
  description: 'Heavy zoner with hover mechanics',
  archetype: 'Heavy Zoner',
  stats: {
    weight: 140,
    speed: 6,
    jumpHeight: 10,
    airSpeed: 8, // Hover capability
    fallSpeed: 4, // Slow fall due to rotors
    dashSpeed: 7,
    shieldSize: 1.3,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Rotor Spin',
      type: 'light',
      startupFrames: 6,
      activeFrames: 8, // Multi-hit
      recoveryFrames: 12,
      damage: 2, // Per hit
      baseKnockback: new Vector3(1, 1, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(2.5, 2.5, 1),
      hitboxOffset: new Vector3(0, 1.5, 0)
    },
    special: {
      name: 'Missile Strike',
      type: 'special',
      startupFrames: 24,
      activeFrames: 3,
      recoveryFrames: 28,
      damage: 16,
      baseKnockback: new Vector3(11, 4, 0),
      knockbackAngle: 35,
      hitboxSize: new Vector3(1.5, 1, 1), // Projectile
      hitboxOffset: new Vector3(5, 0, 0)
    },
    smash: {
      name: 'Carpet Bomb',
      type: 'smash',
      startupFrames: 30,
      activeFrames: 10,
      recoveryFrames: 35,
      damage: 24,
      baseKnockback: new Vector3(13, 8, 0),
      knockbackAngle: 60,
      hitboxSize: new Vector3(4, 2, 1),
      hitboxOffset: new Vector3(0, -2, 0)
    },
    grab: {
      name: 'Winch Cable',
      type: 'grab',
      startupFrames: 10,
      activeFrames: 5,
      recoveryFrames: 20,
      damage: 11,
      baseKnockback: new Vector3(6, 7, 0),
      knockbackAngle: 75,
      hitboxSize: new Vector3(1, 3, 1), // Long vertical reach
      hitboxOffset: new Vector3(0, -1, 0)
    }
  },
  modelPath: '/assets/fighters/helicopter/model.glb',
  animationPaths: {
    idle: '/assets/fighters/helicopter/idle.glb',
    walk: '/assets/fighters/helicopter/walk.glb',
    jump: '/assets/fighters/helicopter/jump.glb',
    attack: '/assets/fighters/helicopter/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/helicopter/rotor.ogg',
    ko: '/assets/fighters/helicopter/crash.ogg'
  },
  uniqueNotes: 'Rotor multi-hit, rising recovery'
}