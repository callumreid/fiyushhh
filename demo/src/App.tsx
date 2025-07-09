import React, { useEffect, useRef, useState } from 'react'
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core'

type GameState = 'menu' | 'player-select' | 'stage-select' | 'character-select' | 'game'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>('menu')
  const [fps, setFps] = useState(0)
  const [playerCount, setPlayerCount] = useState(2)
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [currentSelectingPlayer, setCurrentSelectingPlayer] = useState(0)
  const [selectedStage, setSelectedStage] = useState('Game Show Set')
  
  // Complete fighter roster
  const fighters = [
    { id: 'alex-trebek', name: 'Alex Trebek', color: '#ff6b6b', archetype: 'Balanced' },
    { id: 'cow', name: 'Cow', color: '#4ecdc4', archetype: 'Heavy Tank' },
    { id: 'dr-shen', name: 'Dr Shen', color: '#45b7d1', archetype: 'Technical' },
    { id: 'next-coming-of-christ', name: 'Next Coming of Christ', color: '#f9ca24', archetype: 'Floaty Mage' },
    { id: 'helicopter', name: 'Helicopter', color: '#a29bfe', archetype: 'Heavy Zoner' },
    { id: 'angry-turkey', name: 'Angry Turkey', color: '#fd79a8', archetype: 'Glass Cannon' },
    { id: 'two-babies-with-knives', name: 'Two Babies w/ Knives', color: '#fdcb6e', archetype: 'Dual-Stance' },
    { id: 'two-beer-muizz', name: 'Two-Beer Muizz', color: '#e17055', archetype: 'Drunken Brawler' }
  ]

  const stages = [
    { id: 'office-rooftop', name: 'Office Rooftop', description: 'Flat stage with urban backdrop' },
    { id: 'game-show-set', name: 'Game Show Set', description: 'Tri-platform layout with center stage' },
    { id: 'cow-pasture', name: 'Cow Pasture', description: 'Dual side platforms in pastoral setting' },
    { id: 'neon-night', name: 'Neon Night', description: 'Center tower with neon cityscape' },
    { id: 'bird-clouds', name: 'Bird Clouds', description: 'Moving platforms in the sky' }
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    })

    const scene = new Scene(engine)
    const camera = new FreeCamera('camera1', new Vector3(0, 8, -15), scene)
    camera.setTarget(Vector3.Zero())

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Create stage
    const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 20 }, scene)
    const groundMaterial = new StandardMaterial('groundMat', scene)
    groundMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3)
    ground.material = groundMaterial

    // Create platforms (Game Show Set style)
    const platforms = [
      { pos: new Vector3(-12, 4, 0), size: { width: 8, height: 0.5, depth: 8 } },
      { pos: new Vector3(12, 4, 0), size: { width: 8, height: 0.5, depth: 8 } },
      { pos: new Vector3(0, 8, 0), size: { width: 10, height: 0.5, depth: 8 } }
    ]

    platforms.forEach((platform, index) => {
      const plat = MeshBuilder.CreateBox(`platform${index}`, platform.size, scene)
      plat.position = platform.pos
      const platMaterial = new StandardMaterial(`platMat${index}`, scene)
      platMaterial.diffuseColor = new Color3(0.6, 0.6, 0.6)
      plat.material = platMaterial
    })

    // Create fighter representations based on selection
    const fighterMeshes: any[] = []
    if (selectedCharacters.length > 0) {
      selectedCharacters.forEach((characterId, index) => {
        const fighter = fighters.find(f => f.id === characterId)!
        const mesh = MeshBuilder.CreateBox(`fighter${index}`, { size: 2, height: 3, depth: 1 }, scene)
        mesh.position = new Vector3((index - (selectedCharacters.length - 1) / 2) * 8, 2, 0)
        
        const material = new StandardMaterial(`fighterMat${index}`, scene)
        material.diffuseColor = Color3.FromHexString(fighter.color)
        mesh.material = material
        
        fighterMeshes.push(mesh)
      })
    } else {
      // Show default demo fighters if no selection
      fighters.slice(0, 4).forEach((fighter, index) => {
        const mesh = MeshBuilder.CreateBox(`fighter${index}`, { size: 2, height: 3, depth: 1 }, scene)
        mesh.position = new Vector3((index - 1.5) * 8, 2, 0)
        
        const material = new StandardMaterial(`fighterMat${index}`, scene)
        material.diffuseColor = Color3.FromHexString(fighter.color)
        mesh.material = material
        
        fighterMeshes.push(mesh)
      })
    }

    // Animation loop
    let time = 0
    engine.runRenderLoop(() => {
      time += 0.02
      
      // Animate fighters
      fighterMeshes.forEach((mesh, index) => {
        mesh.position.y = 2 + Math.sin(time + index * 0.5) * 0.3
        mesh.rotation.y = Math.sin(time * 0.3 + index) * 0.2
      })
      
      scene.render()
      setFps(Math.round(engine.getFps()))
    })

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter' && gameState === 'menu') {
        setGameState('player-select')
      } else if (event.code === 'Escape') {
        if (gameState === 'character-select') {
          setGameState('stage-select')
        } else if (gameState === 'stage-select') {
          setGameState('player-select')
        } else if (gameState === 'player-select') {
          setGameState('menu')
        } else {
          setGameState('menu')
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyPress)
      engine.dispose()
    }
  }, [gameState])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      
      {/* Title Screen */}
      {gameState === 'menu' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          zIndex: 1000
        }}>
          <h1 style={{ 
            fontSize: '72px', 
            marginBottom: '20px', 
            textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
            animation: 'pulse 2s infinite' 
          }}>
            LUNCHTIME <span style={{ color: '#ffd700' }}>SMASH</span>
          </h1>
          
          <p style={{ fontSize: '24px', marginBottom: '60px', textAlign: 'center' }}>
            Fast-paced platform fighter for Fire TV
          </p>

          <button
            onClick={() => setGameState('player-select')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid #ffd700',
              color: 'white',
              fontSize: '42px',
              fontWeight: 'bold',
              padding: '20px 60px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '30px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            PLAY
          </button>
          
          <p style={{ position: 'absolute', bottom: '40px', fontSize: '16px', opacity: 0.8, textAlign: 'center' }}>
            Press Enter to start • Use arrow keys to navigate
          </p>
        </div>
      )}

      {/* Player Count Selection */}
      {gameState === 'player-select' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          zIndex: 1000
        }}>
          <h2 style={{ 
            fontSize: '48px', 
            marginBottom: '40px', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' 
          }}>
            SELECT NUMBER OF PLAYERS
          </h2>
          
          <div style={{ display: 'flex', gap: '30px', marginBottom: '60px' }}>
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => {
                  setPlayerCount(count)
                  setSelectedCharacters([])
                  setCurrentSelectingPlayer(0)
                  setGameState('stage-select')
                }}
                style={{
                  background: playerCount === count 
                    ? 'rgba(255, 215, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: playerCount === count 
                    ? '3px solid #ffd700' 
                    : '3px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  padding: '30px 40px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = playerCount === count 
                    ? 'rgba(255, 215, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {count}
              </button>
            ))}
          </div>
          
          <p style={{ fontSize: '18px', opacity: 0.8, textAlign: 'center', marginBottom: '20px' }}>
            Choose how many players will be fighting
          </p>
          
          <p style={{ position: 'absolute', bottom: '40px', fontSize: '16px', opacity: 0.7, textAlign: 'center' }}>
            Click to select • ESC: Back to menu
          </p>
        </div>
      )}

      {/* Stage Selection */}
      {gameState === 'stage-select' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(72, 84, 96, 0.95) 0%, rgba(44, 62, 80, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          zIndex: 1000
        }}>
          <h2 style={{ 
            fontSize: '48px', 
            marginBottom: '40px', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' 
          }}>
            SELECT STAGE
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto 40px',
            padding: '0 20px'
          }}>
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                onClick={() => {
                  setSelectedStage(stage.name)
                  setGameState('character-select')
                }}
                style={{
                  background: selectedStage === stage.name 
                    ? 'rgba(255, 215, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: selectedStage === stage.name 
                    ? '3px solid #ffd700' 
                    : '3px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedStage === stage.name 
                    ? 'rgba(255, 215, 0, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 15px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}>
                  🏟️
                </div>
                
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {stage.name}
                </div>
                
                <div style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.4' }}>
                  {stage.description}
                </div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: '18px', opacity: 0.8, textAlign: 'center', marginBottom: '20px' }}>
            Choose your battlefield for {playerCount} players
          </p>
          
          <p style={{ position: 'absolute', bottom: '40px', fontSize: '16px', opacity: 0.7, textAlign: 'center' }}>
            Click to select stage • ESC: Back to player select
          </p>
        </div>
      )}

      {/* Character Selection */}
      {gameState === 'character-select' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(45, 52, 54, 0.95) 0%, rgba(99, 110, 114, 0.95) 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          zIndex: 1000,
          padding: '20px',
          overflow: 'auto'
        }}>
          <h2 style={{ 
            fontSize: '36px', 
            marginBottom: '20px', 
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' 
          }}>
            CHARACTER SELECT
          </h2>
          
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            fontSize: '20px',
            color: currentSelectingPlayer < playerCount ? '#ffd700' : '#4ecdc4'
          }}>
            {currentSelectingPlayer < playerCount ? (
              <>Player {currentSelectingPlayer + 1} - Choose your fighter!</>
            ) : (
              <>All players selected! Ready to fight!</>
            )}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto 40px'
          }}>
            {fighters.map((fighter, index) => {
              const isSelected = selectedCharacters.includes(fighter.id)
              const isAvailable = !isSelected && currentSelectingPlayer < playerCount
              
              return (
                <div
                  key={fighter.id}
                  onClick={() => {
                    if (isAvailable) {
                      const newSelected = [...selectedCharacters, fighter.id]
                      setSelectedCharacters(newSelected)
                      
                      if (newSelected.length < playerCount) {
                        setCurrentSelectingPlayer(currentSelectingPlayer + 1)
                      } else {
                        setGameState('game')
                      }
                    }
                  }}
                  style={{
                    background: isSelected 
                      ? `linear-gradient(135deg, ${fighter.color}, rgba(255,255,255,0.2))`
                      : isAvailable 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(100, 100, 100, 0.3)',
                    border: isSelected 
                      ? '3px solid #ffd700' 
                      : isAvailable 
                        ? '3px solid rgba(255, 255, 255, 0.3)' 
                        : '3px solid rgba(100, 100, 100, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    opacity: isAvailable ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    margin: '0 auto 10px',
                    background: `linear-gradient(135deg, ${fighter.color}, rgba(255,255,255,0.3))`,
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
                      color: '#ffd700'
                    }}>
                      P{selectedCharacters.indexOf(fighter.id) + 1}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              Selected: {selectedCharacters.length} / {playerCount}
            </div>
            
            {selectedCharacters.length === playerCount && (
              <button
                onClick={() => setGameState('game')}
                style={{
                  background: 'rgba(76, 217, 100, 0.3)',
                  border: '3px solid #4cd564',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(76, 217, 100, 0.5)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(76, 217, 100, 0.3)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                START FIGHT!
              </button>
            )}
          </div>
          
          <p style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', opacity: 0.7, textAlign: 'center' }}>
            Click fighters to select • ESC: Back to stage select
          </p>
        </div>
      )}

      {/* Game Demo */}
      {gameState === 'game' && (
        <>
          {/* Fighter HUDs */}
          {selectedCharacters.map((characterId, index) => {
            const fighter = fighters.find(f => f.id === characterId)!
            const positions = [
              { top: '20px', left: '20px' },
              { top: '20px', right: '20px' },
              { bottom: '100px', left: '20px' },
              { bottom: '100px', right: '20px' }
            ]
            
            return (
              <div
                key={fighter.id}
                style={{
                  position: 'absolute',
                  ...positions[index],
                  background: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '12px',
                  minWidth: '140px',
                  border: `3px solid ${fighter.color}`,
                  color: 'white',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.8 }}>
                  P{index + 1}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {fighter.name}
                </div>
                <div style={{ fontSize: '10px', marginBottom: '8px', opacity: 0.7 }}>
                  {fighter.archetype}
                </div>
                <div style={{ 
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  0%
                </div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: fighter.color,
                        border: '1px solid white'
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Center Info */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '30px',
            borderRadius: '12px',
            fontFamily: 'Arial, sans-serif',
            border: '2px solid #ffd700'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '15px', color: '#ffd700' }}>
              🥊 FIGHT! 🥊
            </div>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              <strong>Players:</strong> {playerCount} • <strong>Stage:</strong> {selectedStage}
            </div>
            <div style={{ fontSize: '14px', marginBottom: '15px', opacity: 0.9 }}>
              {selectedCharacters.length > 0 ? 
                `Selected fighters: ${selectedCharacters.map(id => fighters.find(f => f.id === id)?.name).join(', ')}` :
                'Demo mode with default fighters'
              }
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Game flow complete • Character selection working<br/>
              Ready for combat implementation!
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setGameState('menu')}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #ffd700',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            ← Back to Menu (ESC)
          </button>
        </>
      )}

      {/* Performance Monitor */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: fps >= 55 ? '#4ecdc4' : fps >= 30 ? '#f9ca24' : '#ff6b6b',
        padding: '8px 16px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000,
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        🚀 {fps} FPS | Babylon.js 6.x | MVP Status: COMPLETE ✅
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}
      </style>
    </div>
  )
}

export default App