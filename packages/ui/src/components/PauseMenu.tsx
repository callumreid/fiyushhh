import React, { useState, useEffect } from 'react'

interface PauseMenuProps {
  onResume: () => void
  onQuit: () => void
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit }) => {
  const [selectedOption, setSelectedOption] = useState(0)

  const options = [
    { label: 'RESUME', action: onResume },
    { label: 'QUIT TO MENU', action: onQuit }
  ]

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
          options[selectedOption]?.action()
          break
        case 'Escape':
          onResume()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedOption, options, onResume])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '60px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '40px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          PAUSED
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
                fontSize: '24px',
                fontWeight: 'bold',
                padding: '16px 40px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
              }}
              onMouseEnter={() => setSelectedOption(index)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '40px',
          fontSize: '14px',
          opacity: 0.7
        }}>
          ↑↓ Navigate • Enter: Select • Esc: Resume
        </div>
      </div>
    </div>
  )
}