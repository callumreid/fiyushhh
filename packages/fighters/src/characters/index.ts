export * from './alexTrebek'
export * from './cow'
export * from './drShen'
export * from './nextComingOfChrist'
export * from './helicopter'
export * from './angryTurkey'
export * from './twoBabiesWithKnives'
export * from './twoBeerMuizz'

import { FighterData } from '../types'
import { alexTrebek } from './alexTrebek'
import { cow } from './cow'
import { drShen } from './drShen'
import { nextComingOfChrist } from './nextComingOfChrist'
import { helicopter } from './helicopter'
import { angryTurkey } from './angryTurkey'
import { twoBabiesWithKnives } from './twoBabiesWithKnives'
import { twoBeerMuizz } from './twoBeerMuizz'

export const ALL_FIGHTERS: Record<string, FighterData> = {
  'alex-trebek': alexTrebek,
  'cow': cow,
  'dr-shen': drShen,
  'next-coming-of-christ': nextComingOfChrist,
  'helicopter': helicopter,
  'angry-turkey': angryTurkey,
  'two-babies-with-knives': twoBabiesWithKnives,
  'two-beer-muizz': twoBeerMuizz
}

export const getFighterById = (id: string): FighterData | undefined => {
  return ALL_FIGHTERS[id]
}