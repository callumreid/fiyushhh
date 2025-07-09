import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const cow: FighterData = {
  id: 'cow',
  name: 'Cow',
  description: 'Heavy tank with powerful charge attacks',
  archetype: 'Heavy Tank',
  stats: {
    weight: 150,
    speed: 5,
    jumpHeight: 8,
    airSpeed: 4,
    fallSpeed: 12,
    dashSpeed: 6,
    shieldSize: 1.2,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Hoof Kick',
      type: 'light',
      startupFrames: 5,
      activeFrames: 3,
      recoveryFrames: 10,
      damage: 7,
      baseKnockback: new Vector3(4, 1, 0),
      knockbackAngle: 30,
      hitboxSize: new Vector3(1.8, 1.2, 1),
      hitboxOffset: new Vector3(1.2, -0.5, 0)
    },
    special: {
      name: 'Head-butt Charge',
      type: 'special',
      startupFrames: 20,
      activeFrames: 12,
      recoveryFrames: 18,
      damage: 15,
      baseKnockback: new Vector3(10, 3, 0),
      knockbackAngle: 25,
      hitboxSize: new Vector3(2.5, 2, 1),
      hitboxOffset: new Vector3(2, 0, 0)
    },
    smash: {
      name: 'Stampede',
      type: 'smash',
      startupFrames: 25,
      activeFrames: 6,
      recoveryFrames: 30,
      damage: 22,
      baseKnockback: new Vector3(15, 6, 0),
      knockbackAngle: 40,
      hitboxSize: new Vector3(3, 2.5, 1),
      hitboxOffset: new Vector3(2, 0, 0)
    },
    grab: {
      name: 'Moo Grab',
      type: 'grab',
      startupFrames: 8,
      activeFrames: 4,
      recoveryFrames: 18,
      damage: 10,
      baseKnockback: new Vector3(5, 5, 0),
      knockbackAngle: 70,
      hitboxSize: new Vector3(1.5, 2, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    }
  },
  modelPath: '/assets/fighters/cow/model.glb',
  animationPaths: {
    idle: '/assets/fighters/cow/idle.glb',
    walk: '/assets/fighters/cow/walk.glb',
    jump: '/assets/fighters/cow/jump.glb',
    attack: '/assets/fighters/cow/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/cow/moo.ogg',
    ko: '/assets/fighters/cow/moo-sad.ogg'
  },
  uniqueNotes: 'Chargeable head-butt; mooo parry SFX'
}