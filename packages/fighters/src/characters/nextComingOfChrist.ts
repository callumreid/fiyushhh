import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const nextComingOfChrist: FighterData = {
  id: 'next-coming-of-christ',
  name: 'Next Coming of Christ',
  description: 'Floaty mage with divine projectiles',
  archetype: 'Floaty Mage',
  stats: {
    weight: 80,
    speed: 6,
    jumpHeight: 18, // Double jump capable
    airSpeed: 9,
    fallSpeed: 5,
    dashSpeed: 8,
    shieldSize: 1.1,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Divine Touch',
      type: 'light',
      startupFrames: 4,
      activeFrames: 3,
      recoveryFrames: 8,
      damage: 5,
      baseKnockback: new Vector3(3, 2, 0),
      knockbackAngle: 50,
      hitboxSize: new Vector3(1.3, 1.3, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    },
    special: {
      name: 'Halo Projectile',
      type: 'special',
      startupFrames: 18,
      activeFrames: 5,
      recoveryFrames: 22,
      damage: 13,
      baseKnockback: new Vector3(8, 4, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(1, 1, 1), // Projectile
      hitboxOffset: new Vector3(4, 0, 0)
    },
    smash: {
      name: 'Heavenly Smite',
      type: 'smash',
      startupFrames: 20,
      activeFrames: 6,
      recoveryFrames: 24,
      damage: 19,
      baseKnockback: new Vector3(12, 10, 0),
      knockbackAngle: 75,
      hitboxSize: new Vector3(2.5, 3, 1),
      hitboxOffset: new Vector3(1, 1, 0)
    },
    grab: {
      name: 'Blessing Bind',
      type: 'grab',
      startupFrames: 7,
      activeFrames: 4,
      recoveryFrames: 16,
      damage: 7,
      baseKnockback: new Vector3(5, 6, 0),
      knockbackAngle: 80,
      hitboxSize: new Vector3(1.4, 1.8, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    }
  },
  modelPath: '/assets/fighters/next-coming-of-christ/model.glb',
  animationPaths: {
    idle: '/assets/fighters/next-coming-of-christ/idle.glb',
    walk: '/assets/fighters/next-coming-of-christ/walk.glb',
    jump: '/assets/fighters/next-coming-of-christ/jump.glb',
    attack: '/assets/fighters/next-coming-of-christ/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/next-coming-of-christ/blessing.ogg',
    ko: '/assets/fighters/next-coming-of-christ/ascend.ogg'
  },
  uniqueNotes: 'Double mid-air jump; halo projectile'
}