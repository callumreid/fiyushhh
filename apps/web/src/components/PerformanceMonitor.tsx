import React, { useEffect, useState } from 'react'
import { Engine } from '@babylonjs/core'

interface PerformanceMonitorProps {
  engine: Engine | null
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ engine }) => {
  const [fps, setFps] = useState(0)
  const [frameTime, setFrameTime] = useState(0)

  useEffect(() => {
    if (!engine) return

    const interval = setInterval(() => {
      setFps(Math.round(engine.getFps()))
      setFrameTime(Math.round(engine.getDeltaTime() * 10) / 10)
    }, 100)

    return () => clearInterval(interval)
  }, [engine])

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 1000,
      }}
    >
      <div>FPS: {fps}</div>
      <div>Frame: {frameTime}ms</div>
    </div>
  )
}