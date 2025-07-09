import { Scene, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core'
import { FighterData } from './types'
import { Fighter } from './Fighter'
import { PhysicsSystem } from '@lunchtime-smash/systems'

export class FighterLoader {
  private scene: Scene
  private physicsSystem: PhysicsSystem

  constructor(scene: Scene, physicsSystem: PhysicsSystem) {
    this.scene = scene
    this.physicsSystem = physicsSystem
  }

  public async loadFighter(
    fighterData: FighterData,
    playerId: number,
    spawnPosition: Vector3,
    playerColor: Color3
  ): Promise<Fighter> {
    // For MVP, create placeholder low-poly meshes
    const mesh = await this.createPlaceholderMesh(fighterData, playerColor)
    mesh.position = spawnPosition.clone()
    
    return new Fighter(fighterData, mesh, this.scene, this.physicsSystem, playerId)
  }

  private async createPlaceholderMesh(fighterData: FighterData, color: Color3): Promise<Mesh> {
    // Create a simple colored cube as placeholder
    const mesh = MeshBuilder.CreateBox(
      `fighter-${fighterData.id}`,
      { size: 2, height: 3, depth: 1 },
      this.scene
    )

    // Create material with player color
    const material = new StandardMaterial(`${fighterData.id}-material`, this.scene)
    material.diffuseColor = color
    material.specularColor = new Color3(0.2, 0.2, 0.2)
    mesh.material = material

    return mesh
  }

  public async loadFromGLB(path: string): Promise<Mesh> {
    // TODO: Implement GLB loading for post-MVP
    // This would use @babylonjs/loaders to import 3D models
    throw new Error('GLB loading not implemented in MVP')
  }

  public getPlayerColors(): Color3[] {
    return [
      new Color3(0.8, 0.2, 0.2), // Red
      new Color3(0.2, 0.2, 0.8), // Blue
      new Color3(0.2, 0.8, 0.2), // Green
      new Color3(0.8, 0.8, 0.2), // Yellow
    ]
  }

  public dispose(): void {
    // Cleanup resources if needed
  }
}