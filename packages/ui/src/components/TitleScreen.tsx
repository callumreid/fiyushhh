import React, { useState, useEffect } from 'react'

interface TitleScreenProps {
  onPlay: () => void
  onSettings?: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onPlay, onSettings }) => {
  const [selectedOption, setSelectedOption] = useState(0)
  const [pulseAnimation, setPulseAnimation] = useState(false)

  const options = [
    { label: 'PLAY', action: onPlay },
    ...(onSettings ? [{ label: 'SETTINGS', action: onSettings }] : [])
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
          setSelectedOption(prev => Math.max(0, prev - 1))
          break
        case 'ArrowDown':
          setSelectedOption(prev => Math.min(options.length - 1, prev + 1))
          break
        case 'Enter':
        case 'Space':
          options[selectedOption]?.action()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedOption, options])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 2000
    }}>
      {/* Title */}
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '60px',
        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        animation: pulseAnimation ? 'pulse 1s ease-in-out' : 'none'
      }}>
        LUNCHTIME
        <br />
        <span style={{ color: '#ffd700' }}>SMASH</span>
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: '24px',
        marginBottom: '80px',
        textAlign: 'center',
        opacity: 0.9
      }}>
        Fast-paced platform fighter for Fire TV
      </div>

      {/* Menu Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        {options.map((option, index) => (
          <button
            key={option.label}
            onClick={option.action}
            style={{
              background: selectedOption === index 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: selectedOption === index 
                ? '3px solid #ffd700' 
                : '3px solid transparent',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              padding: '16px 48px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}
            onMouseEnter={() => setSelectedOption(index)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        fontSize: '16px',
        opacity: 0.7,
        textAlign: 'center'
      }}>
        Use ↑↓ arrows and Enter to navigate • Press any gamepad button to start
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  )
}