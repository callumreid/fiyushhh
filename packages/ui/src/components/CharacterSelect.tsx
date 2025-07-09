import React, { useState, useEffect } from 'react'
import { ALL_FIGHTERS, FighterData } from '@lunchtime-smash/fighters'

interface CharacterSelectProps {
  maxPlayers: number
  onSelectionComplete: (selections: { playerId: number; fighterId: string }[]) => void
  onBack: () => void
}

interface PlayerSelection {
  playerId: number
  selectedFighterId?: string
  cursorPosition: number
  isReady: boolean
  isActive: boolean
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  maxPlayers,
  onSelectionComplete,
  onBack
}) => {
  const fighterList = Object.values(ALL_FIGHTERS)
  const [playerSelections, setPlayerSelections] = useState<PlayerSelection[]>(() =>
    Array.from({ length: maxPlayers }, (_, i) => ({
      playerId: i,
      cursorPosition: 0,
      isReady: false,
      isActive: i === 0 // Player 1 starts active
    }))
  )

  const getPlayerColor = (playerId: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    return colors[playerId] || '#ffffff'
  }

  const handlePlayerAction = (playerId: number, action: string) => {
    setPlayerSelections(prev => prev.map(selection => {
      if (selection.playerId !== playerId) return selection

      switch (action) {
        case 'left':
          return {
            ...selection,
            cursorPosition: Math.max(0, selection.cursorPosition - 1)
          }
        case 'right':
          return {
            ...selection,
            cursorPosition: Math.min(fighterList.length - 1, selection.cursorPosition + 1)
          }
        case 'select':
          if (!selection.isReady) {
            return {
              ...selection,
              selectedFighterId: fighterList[selection.cursorPosition].id,
              isReady: true
            }
          } else {
            return {
              ...selection,
              selectedFighterId: undefined,
              isReady: false
            }
          }
        case 'back':
          if (selection.isReady) {
            return {
              ...selection,
              selectedFighterId: undefined,
              isReady: false
            }
          }
          break
      }
      return selection
    }))
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Player 1 controls (keyboard)
      switch (event.code) {
        case 'ArrowLeft':
          handlePlayerAction(0, 'left')
          break
        case 'ArrowRight':
          handlePlayerAction(0, 'right')
          break
        case 'Enter':
          handlePlayerAction(0, 'select')
          break
        case 'Escape':
          handlePlayerAction(0, 'back')
          if (!playerSelections[0].isReady) {
            onBack()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerSelections, onBack])

  useEffect(() => {
    // Check if we can proceed (at least 2 players ready)
    const readyPlayers = playerSelections.filter(p => p.isReady && p.selectedFighterId)
    if (readyPlayers.length >= 2) {
      // Auto-advance after short delay
      const timer = setTimeout(() => {
        onSelectionComplete(readyPlayers.map(p => ({
          playerId: p.playerId,
          fighterId: p.selectedFighterId!
        })))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [playerSelections, onSelectionComplete])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 2000
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 0',
        fontSize: '48px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        CHARACTER SELECT
      </div>

      {/* Fighter Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        padding: '0 60px',
        marginBottom: '40px'
      }}>
        {fighterList.map((fighter, index) => {
          const isHovered = playerSelections.some(p => 
            p.cursorPosition === index && p.isActive && !p.isReady
          )
          const isSelected = playerSelections.some(p => 
            p.selectedFighterId === fighter.id
          )
          const selectingPlayer = playerSelections.find(p => 
            p.selectedFighterId === fighter.id
          )

          return (
            <div
              key={fighter.id}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${getPlayerColor(selectingPlayer!.playerId)}, rgba(255,255,255,0.2))`
                  : isHovered 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                border: isHovered ? '3px solid #ffd700' : '3px solid transparent',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {/* Fighter portrait placeholder */}
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 10px',
                background: `linear-gradient(135deg, ${getPlayerColor(index)}, rgba(255,255,255,0.3))`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {fighter.name.charAt(0)}
              </div>

              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                {fighter.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {fighter.archetype}
              </div>

              {isSelected && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: getPlayerColor(selectingPlayer!.playerId)
                }}>
                  P{selectingPlayer!.playerId + 1}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Player Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px'
      }}>
        {playerSelections.slice(0, 4).map(player => (
          <div
            key={player.playerId}
            style={{
              padding: '16px',
              background: player.isReady 
                ? `linear-gradient(135deg, ${getPlayerColor(player.playerId)}, rgba(255,255,255,0.2))`
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '120px',
              border: player.isActive ? '2px solid #ffd700' : '2px solid transparent'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              Player {player.playerId + 1}
            </div>
            {player.isReady && player.selectedFighterId ? (
              <div>
                <div style={{ fontSize: '14px', color: '#4ecdc4' }}>READY</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  {ALL_FIGHTERS[player.selectedFighterId]?.name}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '14px', opacity: 0.7 }}>
                {player.isActive ? 'Selecting...' : 'Press button to join'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        fontSize: '16px',
        opacity: 0.8
      }}>
        ←→ Navigate • Enter: Select • Esc: Back • Need 2+ players to continue
      </div>
    </div>
  )
}