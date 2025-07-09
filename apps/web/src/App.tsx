import React, { useEffect, useRef, useState } from 'react'
import { Engine, Scene } from '@babylonjs/core'
import { PerformanceMonitor } from './components/PerformanceMonitor'
import { GameManager } from './GameManager'
import { GameUI } from '@lunchtime-smash/ui'
import { GameStateType } from '@lunchtime-smash/game-core'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const gameManagerRef = useRef<GameManager | null>(null)

  const [gameState, setGameState] = useState<GameStateType>(GameStateType.MENU)
  const [players, setPlayers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Babylon.js engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    })
    engineRef.current = engine

    // Create scene
    const scene = new Scene(engine)
    sceneRef.current = scene

    // Initialize game manager
    const gameManager = new GameManager(scene, engine, canvasRef.current)
    gameManagerRef.current = gameManager

    // Game update loop
    engine.runRenderLoop(() => {
      gameManager.update()
      scene.render()
      
      // Update UI state
      const currentGameState = gameManager.getGameState().getCurrentState()
      if (currentGameState !== gameState) {
        setGameState(currentGameState)
      }
      
      // Update players for HUD
      const currentPlayers = gameManager.getGameState().getPlayers()
      setPlayers(currentPlayers)
      
      // Update stats for results screen
      if (currentGameState === GameStateType.RESULTS) {
        const matchStats = gameManager.getMatchManager().getStats()
        setStats(matchStats)
      }
    })

    // Handle resize
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      gameManager.dispose()
      engine.dispose()
    }
  }, [])

  const handleStateChange = (newState: GameStateType, data?: any) => {
    if (gameManagerRef.current) {
      gameManagerRef.current.handleStateChange(newState, data)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      
      <GameUI
        gameState={gameState}
        players={players}
        isPaused={gameState === GameStateType.PAUSE}
        stats={stats}
        onStateChange={handleStateChange}
      />
      
      <PerformanceMonitor engine={engineRef.current} />
    </div>
  )
}

export default App