import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const alexTrebek: FighterData = {
  id: 'alex-trebek',
  name: 'Alex Trebek',
  description: 'Balanced quizmaster with knowledge-based attacks',
  archetype: 'Balanced',
  stats: {
    weight: 100,
    speed: 8,
    jumpHeight: 12,
    airSpeed: 6,
    fallSpeed: 8,
    dashSpeed: 10,
    shieldSize: 1.0,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Quiz Card Jab',
      type: 'light',
      startupFrames: 3,
      activeFrames: 2,
      recoveryFrames: 8,
      damage: 5,
      baseKnockback: new Vector3(3, 1, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(1.5, 1, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    },
    special: {
      name: 'Knowledge Beam',
      type: 'special',
      startupFrames: 15,
      activeFrames: 8,
      recoveryFrames: 20,
      damage: 12,
      baseKnockback: new Vector3(8, 2, 0),
      knockbackAngle: 30,
      hitboxSize: new Vector3(5, 1.5, 1),
      hitboxOffset: new Vector3(3, 0, 0)
    },
    smash: {
      name: 'Answer Slam',
      type: 'smash',
      startupFrames: 18,
      activeFrames: 4,
      recoveryFrames: 25,
      damage: 18,
      baseKnockback: new Vector3(12, 8, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(2, 2, 1),
      hitboxOffset: new Vector3(1, 0, 0)
    },
    grab: {
      name: 'Question Grab',
      type: 'grab',
      startupFrames: 7,
      activeFrames: 4,
      recoveryFrames: 15,
      damage: 8,
      baseKnockback: new Vector3(6, 4, 0),
      knockbackAngle: 60,
      hitboxSize: new Vector3(1.2, 1.5, 1),
      hitboxOffset: new Vector3(0.8, 0, 0)
    }
  },
  modelPath: '/assets/fighters/alex-trebek/model.glb',
  animationPaths: {
    idle: '/assets/fighters/alex-trebek/idle.glb',
    walk: '/assets/fighters/alex-trebek/walk.glb',
    jump: '/assets/fighters/alex-trebek/jump.glb',
    attack: '/assets/fighters/alex-trebek/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/alex-trebek/answer.ogg',
    ko: '/assets/fighters/alex-trebek/wrong.ogg'
  },
  uniqueNotes: '"Answer?" taunt; knowledge-beam special'
}