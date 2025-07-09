import React, { useEffect, useRef } from 'react'
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core'
import { PerformanceMonitor } from './components/PerformanceMonitor'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)

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

    // Create camera
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachToCanvas(canvasRef.current, true)

    // Create light
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Create test cube (placeholder for characters)
    const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)
    box.position.y = 1

    // Create ground (placeholder for stage)
    const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)

    // Render loop
    engine.runRenderLoop(() => {
      scene.render()
    })

    // Handle resize
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engine.dispose()
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      <PerformanceMonitor engine={engineRef.current} />
    </div>
  )
}

export default App