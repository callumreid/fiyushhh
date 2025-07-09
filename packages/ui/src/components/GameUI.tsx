import React from 'react'
import { GameStateType } from '@lunchtime-smash/game-core'
import { TitleScreen } from './TitleScreen'
import { CharacterSelect } from './CharacterSelect'
import { StageSelect } from './StageSelect'
import { HUD } from './HUD'
import { PauseMenu } from './PauseMenu'
import { ResultsScreen } from './ResultsScreen'

interface GameUIProps {
  gameState: GameStateType
  players?: any[]
  timeRemaining?: number
  isPaused?: boolean
  stats?: any
  onStateChange: (newState: GameStateType, data?: any) => void
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  players = [],
  timeRemaining,
  isPaused,
  stats,
  onStateChange
}) => {
  const handlePlay = () => {
    onStateChange(GameStateType.CHARACTER_SELECT)
  }

  const handleCharacterSelection = (selections: { playerId: number; fighterId: string }[]) => {
    onStateChange(GameStateType.STAGE_SELECT, { characterSelections: selections })
  }

  const handleStageSelection = (stageId: string) => {
    onStateChange(GameStateType.MATCH, { selectedStage: stageId })
  }

  const handleBackToMenu = () => {
    onStateChange(GameStateType.MENU)
  }

  const handleBackToCharacterSelect = () => {
    onStateChange(GameStateType.CHARACTER_SELECT)
  }

  const handleResume = () => {
    onStateChange(GameStateType.MATCH)
  }

  const handleContinue = () => {
    onStateChange(GameStateType.MENU)
  }

  switch (gameState) {
    case GameStateType.MENU:
      return (
        <TitleScreen 
          onPlay={handlePlay}
        />
      )

    case GameStateType.CHARACTER_SELECT:
      return (
        <CharacterSelect
          maxPlayers={4}
          onSelectionComplete={handleCharacterSelection}
          onBack={handleBackToMenu}
        />
      )

    case GameStateType.STAGE_SELECT:
      return (
        <StageSelect
          onStageSelected={handleStageSelection}
          onBack={handleBackToCharacterSelect}
        />
      )

    case GameStateType.MATCH:
      return (
        <HUD
          players={players}
          timeRemaining={timeRemaining}
          isPaused={isPaused}
        />
      )

    case GameStateType.PAUSE:
      return (
        <>
          <HUD
            players={players}
            timeRemaining={timeRemaining}
            isPaused={true}
          />
          <PauseMenu
            onResume={handleResume}
            onQuit={handleBackToMenu}
          />
        </>
      )

    case GameStateType.RESULTS:
      return (
        <ResultsScreen
          stats={stats}
          players={players}
          onContinue={handleContinue}
        />
      )

    default:
      return null
  }
}