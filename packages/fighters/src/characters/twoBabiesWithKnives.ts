import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const twoBabiesWithKnives: FighterData = {
  id: 'two-babies-with-knives',
  name: 'Two Babies w/ Two Knives',
  description: 'Dual-stance trickster with grab/slash modes',
  archetype: 'Dual-Stance Trickster',
  stats: {
    weight: 90,
    speed: 9,
    jumpHeight: 11,
    airSpeed: 8,
    fallSpeed: 7,
    dashSpeed: 13,
    shieldSize: 0.8,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Baby Slash',
      type: 'light',
      startupFrames: 3,
      activeFrames: 3,
      recoveryFrames: 7,
      damage: 5,
      baseKnockback: new Vector3(3, 1, 0),
      knockbackAngle: 35,
      hitboxSize: new Vector3(1.4, 1.1, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    },
    special: {
      name: 'Stance Switch',
      type: 'special',
      startupFrames: 5,
      activeFrames: 1,
      recoveryFrames: 8,
      damage: 0, // Utility move
      baseKnockback: new Vector3(0, 0, 0),
      knockbackAngle: 0,
      hitboxSize: new Vector3(0, 0, 0),
      hitboxOffset: new Vector3(0, 0, 0)
    },
    smash: {
      name: 'Double Trouble',
      type: 'smash',
      startupFrames: 16,
      activeFrames: 6,
      recoveryFrames: 22,
      damage: 17,
      baseKnockback: new Vector3(10, 6, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(2.2, 1.8, 1),
      hitboxOffset: new Vector3(1.5, 0, 0)
    },
    grab: {
      name: 'Baby Grapple',
      type: 'grab',
      startupFrames: 6,
      activeFrames: 4,
      recoveryFrames: 14,
      damage: 8,
      baseKnockback: new Vector3(6, 3, 0),
      knockbackAngle: 50,
      hitboxSize: new Vector3(1.3, 1.4, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    }
  },
  modelPath: '/assets/fighters/two-babies-with-knives/model.glb',
  animationPaths: {
    idle: '/assets/fighters/two-babies-with-knives/idle.glb',
    walk: '/assets/fighters/two-babies-with-knives/walk.glb',
    jump: '/assets/fighters/two-babies-with-knives/jump.glb',
    attack: '/assets/fighters/two-babies-with-knives/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/two-babies-with-knives/giggle.ogg',
    ko: '/assets/fighters/two-babies-with-knives/cry.ogg'
  },
  uniqueNotes: 'Swap stance for grab vs slash'
}