import { Scene } from '@babylonjs/core'
import { StageData } from './types'
import { Stage } from './Stage'
import { PhysicsSystem } from '@lunchtime-smash/systems'

export class StageLoader {
  private scene: Scene
  private physicsSystem: PhysicsSystem

  constructor(scene: Scene, physicsSystem: PhysicsSystem) {
    this.scene = scene
    this.physicsSystem = physicsSystem
  }

  public async loadStage(stageData: StageData): Promise<Stage> {
    // Clear any existing stage elements
    this.clearStage()
    
    // Create new stage
    const stage = new Stage(stageData, this.scene, this.physicsSystem)
    
    return stage
  }

  private clearStage(): void {
    // Remove existing stage meshes (platforms, backgrounds, etc.)
    const meshesToRemove = this.scene.meshes.filter(mesh => 
      mesh.name.startsWith('platform-') || 
      mesh.name.startsWith('background-') ||
      mesh.name.startsWith('stage-')
    )
    
    meshesToRemove.forEach(mesh => mesh.dispose())
    
    // Remove stage-specific lights
    const lightsToRemove = this.scene.lights.filter(light =>
      light.name.startsWith('stage-') ||
      light.name === 'ambient' ||
      light.name === 'directional'
    )
    
    lightsToRemove.forEach(light => light.dispose())
  }

  public async loadFromGLB(path: string): Promise<Stage> {
    // TODO: Implement GLB stage loading for post-MVP
    // This would use @babylonjs/loaders to import 3D stage models
    throw new Error('GLB stage loading not implemented in MVP')
  }

  public dispose(): void {
    this.clearStage()
  }
}