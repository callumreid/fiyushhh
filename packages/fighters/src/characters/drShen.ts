import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const drShen: FighterData = {
  id: 'dr-shen',
  name: 'Dr Shen',
  description: 'Technical swordsman with extended reach',
  archetype: 'Technical Swordsman',
  stats: {
    weight: 110,
    speed: 7,
    jumpHeight: 10,
    airSpeed: 7,
    fallSpeed: 9,
    dashSpeed: 12,
    shieldSize: 0.9,
    parryWindow: 5 // +2 frames bonus
  },
  moves: {
    light: {
      name: 'Katana Slice',
      type: 'light',
      startupFrames: 4,
      activeFrames: 3,
      recoveryFrames: 9,
      damage: 6,
      baseKnockback: new Vector3(4, 1, 0),
      knockbackAngle: 35,
      hitboxSize: new Vector3(2.5, 1, 1), // Long reach
      hitboxOffset: new Vector3(2, 0, 0)
    },
    special: {
      name: 'Spirit Slash',
      type: 'special',
      startupFrames: 12,
      activeFrames: 6,
      recoveryFrames: 16,
      damage: 14,
      baseKnockback: new Vector3(9, 3, 0),
      knockbackAngle: 40,
      hitboxSize: new Vector3(3, 1.5, 1),
      hitboxOffset: new Vector3(2.5, 0, 0)
    },
    smash: {
      name: 'Iaido Strike',
      type: 'smash',
      startupFrames: 22,
      activeFrames: 2,
      recoveryFrames: 28,
      damage: 20,
      baseKnockback: new Vector3(14, 7, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(3.5, 2, 1),
      hitboxOffset: new Vector3(2.5, 0, 0)
    },
    grab: {
      name: 'Blade Trap',
      type: 'grab',
      startupFrames: 6,
      activeFrames: 4,
      recoveryFrames: 14,
      damage: 9,
      baseKnockback: new Vector3(7, 4, 0),
      knockbackAngle: 55,
      hitboxSize: new Vector3(2, 1.5, 1),
      hitboxOffset: new Vector3(1.5, 0, 0)
    }
  },
  modelPath: '/assets/fighters/dr-shen/model.glb',
  animationPaths: {
    idle: '/assets/fighters/dr-shen/idle.glb',
    walk: '/assets/fighters/dr-shen/walk.glb',
    jump: '/assets/fighters/dr-shen/jump.glb',
    attack: '/assets/fighters/dr-shen/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/dr-shen/honor.ogg',
    ko: '/assets/fighters/dr-shen/dishonor.ogg'
  },
  uniqueNotes: 'Long reach katana tilts; parry window +2 f'
}