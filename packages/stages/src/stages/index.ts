export * from './officeRooftop'
export * from './gameShowSet'
export * from './cowPasture'
export * from './neonNight'
export * from './birdClouds'

import { StageData } from '../types'
import { officeRooftop } from './officeRooftop'
import { gameShowSet } from './gameShowSet'
import { cowPasture } from './cowPasture'
import { neonNight } from './neonNight'
import { birdClouds } from './birdClouds'

export const ALL_STAGES: Record<string, StageData> = {
  'office-rooftop': officeRooftop,
  'game-show-set': gameShowSet,
  'cow-pasture': cowPasture,
  'neon-night': neonNight,
  'bird-clouds': birdClouds
}

export const getStageById = (id: string): StageData | undefined => {
  return ALL_STAGES[id]
}