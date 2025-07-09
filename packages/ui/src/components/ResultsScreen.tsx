import React, { useState, useEffect } from 'react'
import { GameStats, Player } from '@lunchtime-smash/game-core'
import { ALL_FIGHTERS } from '@lunchtime-smash/fighters'

interface ResultsScreenProps {
  stats: GameStats
  players: Player[]
  onContinue: () => void
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  stats, 
  players, 
  onContinue 
}) => {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'Space') {
        onContinue()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onContinue])

  const getPlayerColor = (playerId: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
    return colors[playerId] || '#ffffff'
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const sortedPlayers = [...players].sort((a, b) => {
    // Winner first, then by stocks, then by damage (lower is better)
    if (stats.winner?.id === a.id) return -1
    if (stats.winner?.id === b.id) return 1
    if (a.stocks !== b.stocks) return b.stocks - a.stocks
    return a.damage - b.damage
  })

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Winner Announcement */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        animation: 'fadeInScale 1s ease-out'
      }}>
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
          marginBottom: '20px',
          color: stats.winner ? getPlayerColor(stats.winner.id) : '#ffd700'
        }}>
          {stats.winner ? 'WINNER!' : 'TIME UP!'}
        </div>
        
        {stats.winner && (
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            Player {stats.winner.id + 1}
          </div>
        )}

        {stats.winner && (
          <div style={{
            fontSize: '24px',
            opacity: 0.9
          }}>
            {ALL_FIGHTERS[stats.winner.characterId]?.name || 'Unknown Fighter'}
          </div>
        )}
      </div>

      {/* Match Details */}
      {showDetails && (
        <div style={{
          animation: 'fadeInUp 0.8s ease-out',
          width: '80%',
          maxWidth: '800px'
        }}>
          {/* Results Table */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '28px',
              marginBottom: '30px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              MATCH RESULTS
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 200px 80px 80px 100px 100px',
              gap: '15px',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '20px',
              padding: '0 10px'
            }}>
              <div>Rank</div>
              <div>Fighter</div>
              <div>Stocks</div>
              <div>Damage</div>
              <div>KOs</div>
              <div>Falls</div>
            </div>

            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 200px 80px 80px 100px 100px',
                  gap: '15px',
                  alignItems: 'center',
                  padding: '15px 10px',
                  background: index === 0 
                    ? `linear-gradient(90deg, ${getPlayerColor(player.id)}40, transparent)`
                    : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: index === 0 ? `2px solid ${getPlayerColor(player.id)}` : '2px solid transparent'
                }}
              >
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: getPlayerColor(player.id)
                }}>
                  #{index + 1}
                </div>
                
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    P{player.id + 1} - {ALL_FIGHTERS[player.characterId]?.name || 'Unknown'}
                  </div>
                </div>
                
                <div style={{
                  fontSize: '18px',
                  color: player.stocks > 0 ? '#4ecdc4' : '#ff6b6b'
                }}>
                  {player.stocks}
                </div>
                
                <div style={{ fontSize: '18px' }}>
                  {Math.floor(player.damage)}%
                </div>
                
                <div style={{ fontSize: '18px', color: '#4ecdc4' }}>
                  {stats.kos[player.id] || 0}
                </div>
                
                <div style={{ fontSize: '18px', color: '#ff6b6b' }}>
                  {stats.falls[player.id] || 0}
                </div>
              </div>
            ))}
          </div>

          {/* Match Stats */}
          <div style={{
            textAlign: 'center',
            fontSize: '18px',
            opacity: 0.9,
            marginBottom: '40px'
          }}>
            Match Duration: {formatTime(stats.matchDuration)}
          </div>
        </div>
      )}

      {/* Continue Instruction */}
      <div style={{
        fontSize: '20px',
        opacity: 0.8,
        textAlign: 'center',
        animation: 'pulse 2s infinite'
      }}>
        Press Enter or any button to continue
      </div>

      <style>
        {`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}