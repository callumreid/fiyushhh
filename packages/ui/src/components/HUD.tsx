import React from 'react'
import { Player } from '@lunchtime-smash/game-core'

interface HUDProps {
  players: Player[]
  timeRemaining?: number
  isPaused?: boolean
}

interface PlayerHUDProps {
  player: Player
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ player, position }) => {
  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      padding: '12px',
      minWidth: '120px',
      border: '2px solid',
      borderColor: getPlayerColor(player.id)
    }

    switch (position) {
      case 'top-left':
        return { ...base, top: '20px', left: '20px' }
      case 'top-right':
        return { ...base, top: '20px', right: '20px' }
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' }
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' }
    }
  }

  const getPlayerColor = (playerId: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    return colors[playerId] || '#ffffff'
  }

  return (
    <div style={getPositionStyles()}>
      <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
        P{player.id + 1}
      </div>
      
      {/* Damage percentage */}
      <div style={{ 
        color: player.damage > 100 ? '#ff4757' : '#ffffff',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        {Math.floor(player.damage)}%
      </div>

      {/* Stock indicators */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px', justifyContent: 'center' }}>
        {Array.from({ length: player.stocks }, (_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getPlayerColor(player.id),
              border: '1px solid white'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export const HUD: React.FC<HUDProps> = ({ players, timeRemaining, isPaused }) => {
  const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
    'top-left', 'top-right', 'bottom-left', 'bottom-right'
  ]

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Player HUDs */}
      {players.map((player, index) => (
        <PlayerHUD 
          key={player.id} 
          player={player} 
          position={positions[index]} 
        />
      ))}

      {/* Timer (center top) */}
      {timeRemaining !== undefined && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Pause indicator */}
      {isPaused && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          PAUSED
        </div>
      )}
    </div>
  )
}