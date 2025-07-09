import { Vector3 } from '@babylonjs/core'
import { FighterData } from '../types'

export const twoBeerMuizz: FighterData = {
  id: 'two-beer-muizz',
  name: 'Two-Beer Muizz',
  description: 'Drunken brawler with random armor frames',
  archetype: 'Drunken Brawler',
  stats: {
    weight: 120,
    speed: 7,
    jumpHeight: 9,
    airSpeed: 5,
    fallSpeed: 10,
    dashSpeed: 9,
    shieldSize: 1.0,
    parryWindow: 3
  },
  moves: {
    light: {
      name: 'Stumble Punch',
      type: 'light',
      startupFrames: 4,
      activeFrames: 4,
      recoveryFrames: 10,
      damage: 6,
      baseKnockback: new Vector3(4, 1, 0),
      knockbackAngle: 30,
      hitboxSize: new Vector3(1.6, 1.3, 1),
      hitboxOffset: new Vector3(1.2, 0, 0)
    },
    special: {
      name: 'Beer Bottle Toss',
      type: 'special',
      startupFrames: 16,
      activeFrames: 4,
      recoveryFrames: 20,
      damage: 12,
      baseKnockback: new Vector3(7, 3, 0),
      knockbackAngle: 40,
      hitboxSize: new Vector3(1.2, 1.2, 1), // Projectile
      hitboxOffset: new Vector3(3, 0, 0)
    },
    smash: {
      name: 'Drunken Rage',
      type: 'smash',
      startupFrames: 20,
      activeFrames: 8,
      recoveryFrames: 26,
      damage: 20,
      baseKnockback: new Vector3(13, 7, 0),
      knockbackAngle: 45,
      hitboxSize: new Vector3(2.4, 2, 1),
      hitboxOffset: new Vector3(1.5, 0, 0)
    },
    grab: {
      name: 'Bear Hug',
      type: 'grab',
      startupFrames: 8,
      activeFrames: 5,
      recoveryFrames: 18,
      damage: 10,
      baseKnockback: new Vector3(5, 5, 0),
      knockbackAngle: 65,
      hitboxSize: new Vector3(1.8, 1.8, 1),
      hitboxOffset: new Vector3(1.2, 0, 0)
    }
  },
  modelPath: '/assets/fighters/two-beer-muizz/model.glb',
  animationPaths: {
    idle: '/assets/fighters/two-beer-muizz/idle.glb',
    walk: '/assets/fighters/two-beer-muizz/walk.glb',
    jump: '/assets/fighters/two-beer-muizz/jump.glb',
    attack: '/assets/fighters/two-beer-muizz/attack.glb'
  },
  voicePaths: {
    taunt: '/assets/fighters/two-beer-muizz/hiccup.ogg',
    ko: '/assets/fighters/two-beer-muizz/burp.ogg'
  },
  uniqueNotes: 'Random stumble armour frames'
}