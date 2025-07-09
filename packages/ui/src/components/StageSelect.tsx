import React, { useState, useEffect } from 'react'
import { ALL_STAGES, StageData } from '@lunchtime-smash/stages'

interface StageSelectProps {
  onStageSelected: (stageId: string) => void
  onBack: () => void
}

export const StageSelect: React.FC<StageSelectProps> = ({ onStageSelected, onBack }) => {
  const stageList = Object.values(ALL_STAGES)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewStage, setPreviewStage] = useState<StageData>(stageList[0])

  useEffect(() => {
    setPreviewStage(stageList[selectedIndex])
  }, [selectedIndex, stageList])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          setSelectedIndex(prev => Math.max(0, prev - 1))
          break
        case 'ArrowRight':
          setSelectedIndex(prev => Math.min(stageList.length - 1, prev + 1))
          break
        case 'ArrowUp':
          setSelectedIndex(prev => Math.max(0, prev - 2))
          break
        case 'ArrowDown':
          setSelectedIndex(prev => Math.min(stageList.length - 1, prev + 2))
          break
        case 'Enter':
          onStageSelected(previewStage.id)
          break
        case 'Escape':
          onBack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedIndex, previewStage, onStageSelected, onBack])

  const getStageColor = (stageId: string) => {
    const colors = {
      'office-rooftop': '#ff7675',
      'game-show-set': '#fd79a8',
      'cow-pasture': '#00b894',
      'neon-night': '#6c5ce7',
      'bird-clouds': '#74b9ff'
    }
    return colors[stageId as keyof typeof colors] || '#ddd'
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
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
        STAGE SELECT
      </div>

      <div style={{ display: 'flex', height: 'calc(100% - 200px)' }}>
        {/* Stage Grid */}
        <div style={{
          width: '40%',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {stageList.map((stage, index) => (
            <div
              key={stage.id}
              style={{
                background: selectedIndex === index 
                  ? `linear-gradient(135deg, ${getStageColor(stage.id)}, rgba(255,255,255,0.3))`
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedIndex === index ? '3px solid #ffd700' : '3px solid transparent',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
              onClick={() => setSelectedIndex(index)}
            >
              {/* Stage thumbnail */}
              <div style={{
                width: '80px',
                height: '60px',
                background: `linear-gradient(135deg, ${getStageColor(stage.id)}, rgba(255,255,255,0.2))`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {stage.name.charAt(0)}
              </div>

              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {stage.name}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  {stage.layout}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                  {stage.theme}
                </div>
              </div>
            </div>
          ))}

          {/* Random stage option */}
          <div style={{
            background: 'linear-gradient(135deg, #a29bfe, rgba(255,255,255,0.3))',
            border: '3px solid transparent',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '60px',
              background: 'linear-gradient(135deg, #a29bfe, rgba(255,255,255,0.2))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ?
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Random Stage
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                Surprise me!
              </div>
            </div>
          </div>
        </div>

        {/* Stage Preview */}
        <div style={{
          width: '60%',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Preview area */}
          <div style={{
            flex: 1,
            background: `linear-gradient(135deg, ${getStageColor(previewStage.id)}, rgba(0,0,0,0.3))`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Stage layout visualization */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              height: '60px',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center'
            }}>
              {/* Simple platform visualization */}
              {previewStage.platforms.map((platform, index) => (
                <div
                  key={platform.id}
                  style={{
                    position: 'absolute',
                    left: `${((platform.position.x + 50) / 100) * 100}%`,
                    bottom: `${((platform.position.y + 20) / 50) * 100}%`,
                    width: `${(platform.size.x / 100) * 50}%`,
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '2px',
                    transform: 'translateX(-50%)'
                  }}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', zIndex: 1 }}>
              {previewStage.name}
            </div>
          </div>

          {/* Stage Info */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>
              {previewStage.name}
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '16px', opacity: 0.9 }}>
              {previewStage.description}
            </p>
            
            <div style={{ display: 'flex', gap: '30px', fontSize: '14px' }}>
              <div>
                <strong>Layout:</strong> {previewStage.layout}
              </div>
              <div>
                <strong>Platforms:</strong> {previewStage.platforms.length}
              </div>
              <div>
                <strong>Theme:</strong> {previewStage.theme}
              </div>
            </div>
          </div>
        </div>
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
        ←→↑↓ Navigate • Enter: Select • Esc: Back
      </div>
    </div>
  )
}