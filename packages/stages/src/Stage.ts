import { Scene, Mesh, Vector3, HemisphericLight, DirectionalLight } from '@babylonjs/core'
import { StageData, StageState, Platform } from './types'
import { PhysicsSystem } from '@lunchtime-smash/systems'

export class Stage {
  private stageData: StageData
  private scene: Scene
  private physicsSystem: PhysicsSystem
  private state: StageState
  private platformMeshes: Map<string, Mesh> = new Map()
  private lights: (HemisphericLight | DirectionalLight)[] = []

  constructor(stageData: StageData, scene: Scene, physicsSystem: PhysicsSystem) {
    this.stageData = stageData
    this.scene = scene
    this.physicsSystem = physicsSystem
    this.state = {
      currentFrame: 0,
      movingPlatforms: new Map()
    }

    this.initializeStage()
  }

  private initializeStage(): void {
    this.setupLighting()
    this.createPlatforms()
    this.setupBlastZones()
    this.initializeMovingPlatforms()
  }

  private setupLighting(): void {
    // Clear existing lights
    this.lights.forEach(light => light.dispose())
    this.lights = []

    const config = this.stageData.lightingConfig
    if (config) {
      // Ambient light
      const ambientLight = new HemisphericLight(
        'ambient',
        new Vector3(0, 1, 0),
        this.scene
      )
      ambientLight.diffuse = config.ambient.color
      ambientLight.intensity = config.ambient.intensity
      this.lights.push(ambientLight)

      // Directional light (optional)
      if (config.directional) {
        const dirLight = new DirectionalLight(
          'directional',
          config.directional.direction,
          this.scene
        )
        dirLight.diffuse = config.directional.color
        dirLight.intensity = config.directional.intensity
        this.lights.push(dirLight)
      }
    }
  }

  private createPlatforms(): void {
    this.stageData.platforms.forEach(platform => {
      const mesh = this.createPlatformMesh(platform)
      this.platformMeshes.set(platform.id, mesh)
      this.physicsSystem.createStagePhysics(mesh)
    })
  }

  private createPlatformMesh(platform: Platform): Mesh {
    const mesh = Mesh.CreateBox(
      `platform-${platform.id}`,
      1,
      this.scene
    )
    
    mesh.scaling = platform.size
    mesh.position = platform.position.clone()
    
    return mesh
  }

  private setupBlastZones(): void {
    const zones = this.stageData.blastZones
    this.physicsSystem.setBlastZones(zones.left, zones.right, zones.top, zones.bottom)
  }

  private initializeMovingPlatforms(): void {
    this.stageData.platforms.forEach(platform => {
      if (platform.isMoving && platform.movementPath && platform.movementPath.length > 1) {
        this.state.movingPlatforms.set(platform.id, {
          currentTarget: 1,
          progress: 0
        })
      }
    })
  }

  public update(deltaTime: number): void {
    this.state.currentFrame++
    this.updateMovingPlatforms(deltaTime)
  }

  private updateMovingPlatforms(deltaTime: number): void {
    this.state.movingPlatforms.forEach((movementState, platformId) => {
      const platform = this.stageData.platforms.find(p => p.id === platformId)
      const mesh = this.platformMeshes.get(platformId)
      
      if (!platform || !mesh || !platform.movementPath || !platform.movementSpeed) {
        return
      }

      const path = platform.movementPath
      const currentIndex = movementState.currentTarget - 1
      const targetIndex = movementState.currentTarget
      
      if (currentIndex < 0 || targetIndex >= path.length) return

      const startPos = path[currentIndex]
      const endPos = path[targetIndex]
      const speed = platform.movementSpeed
      
      // Calculate movement progress
      const distance = Vector3.Distance(startPos, endPos)
      const moveAmount = speed * deltaTime * 0.001 // Convert to seconds
      movementState.progress += moveAmount / distance

      if (movementState.progress >= 1.0) {
        // Reached target, move to next
        movementState.progress = 0
        movementState.currentTarget = (movementState.currentTarget + 1) % path.length
        mesh.position = endPos.clone()
      } else {
        // Interpolate position
        mesh.position = Vector3.Lerp(startPos, endPos, movementState.progress)
      }
    })
  }

  public getSpawnPoints(): Vector3[] {
    return this.stageData.spawnPoints.map(sp => sp.position.clone())
  }

  public getBlastZones() {
    return { ...this.stageData.blastZones }
  }

  public getStageData(): StageData {
    return this.stageData
  }

  public getPlatformMesh(platformId: string): Mesh | undefined {
    return this.platformMeshes.get(platformId)
  }

  public dispose(): void {
    this.platformMeshes.forEach(mesh => mesh.dispose())
    this.lights.forEach(light => light.dispose())
    this.platformMeshes.clear()
    this.lights = []
  }
}