import { Scene, FreeCamera, Vector3, Mesh } from '@babylonjs/core'

export interface CameraTarget {
  position: Vector3
  playerId: number
}

export class CameraSystem {
  private camera: FreeCamera
  private scene: Scene
  private targets: CameraTarget[] = []
  private defaultPosition = new Vector3(0, 8, -15)
  private defaultTarget = Vector3.Zero()
  private minZoom = 5
  private maxZoom = 25
  private smoothingFactor = 0.05

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene
    this.camera = new FreeCamera('gameCamera', this.defaultPosition.clone(), scene)
    this.camera.setTarget(this.defaultTarget)
    this.camera.attachToCanvas(canvas, true)
  }

  public addTarget(target: CameraTarget): void {
    const existingIndex = this.targets.findIndex(t => t.playerId === target.playerId)
    if (existingIndex >= 0) {
      this.targets[existingIndex] = target
    } else {
      this.targets.push(target)
    }
  }

  public removeTarget(playerId: number): void {
    this.targets = this.targets.filter(t => t.playerId !== playerId)
  }

  public update(): void {
    if (this.targets.length === 0) {
      this.returnToDefault()
      return
    }

    const bounds = this.calculateBounds()
    const centerPoint = this.calculateCenterPoint()
    const requiredDistance = this.calculateRequiredDistance(bounds)

    // Smooth camera movement
    const targetPosition = new Vector3(
      centerPoint.x,
      this.defaultPosition.y,
      centerPoint.z - requiredDistance
    )

    this.camera.position = Vector3.Lerp(
      this.camera.position,
      targetPosition,
      this.smoothingFactor
    )

    const targetLookAt = new Vector3(centerPoint.x, centerPoint.y, centerPoint.z)
    const currentTarget = this.camera.getTarget()
    const newTarget = Vector3.Lerp(currentTarget, targetLookAt, this.smoothingFactor)
    this.camera.setTarget(newTarget)
  }

  private calculateBounds(): { min: Vector3; max: Vector3 } {
    if (this.targets.length === 0) {
      return { min: Vector3.Zero(), max: Vector3.Zero() }
    }

    let minX = this.targets[0].position.x
    let maxX = this.targets[0].position.x
    let minY = this.targets[0].position.y
    let maxY = this.targets[0].position.y
    let minZ = this.targets[0].position.z
    let maxZ = this.targets[0].position.z

    this.targets.forEach(target => {
      minX = Math.min(minX, target.position.x)
      maxX = Math.max(maxX, target.position.x)
      minY = Math.min(minY, target.position.y)
      maxY = Math.max(maxY, target.position.y)
      minZ = Math.min(minZ, target.position.z)
      maxZ = Math.max(maxZ, target.position.z)
    })

    return {
      min: new Vector3(minX, minY, minZ),
      max: new Vector3(maxX, maxY, maxZ)
    }
  }

  private calculateCenterPoint(): Vector3 {
    if (this.targets.length === 0) {
      return this.defaultTarget
    }

    const sum = this.targets.reduce(
      (acc, target) => acc.add(target.position),
      Vector3.Zero()
    )

    return sum.scale(1 / this.targets.length)
  }

  private calculateRequiredDistance(bounds: { min: Vector3; max: Vector3 }): number {
    const width = bounds.max.x - bounds.min.x
    const height = bounds.max.y - bounds.min.y

    // Calculate distance needed to fit all targets in view
    const fov = this.camera.fov
    const aspect = this.scene.getEngine().getAspectRatio(this.camera)
    
    const distanceForWidth = (width / 2) / Math.tan(fov * aspect / 2)
    const distanceForHeight = (height / 2) / Math.tan(fov / 2)
    
    const requiredDistance = Math.max(distanceForWidth, distanceForHeight) + 5 // Add buffer

    // Clamp to min/max zoom
    return Math.max(this.minZoom, Math.min(this.maxZoom, requiredDistance))
  }

  private returnToDefault(): void {
    this.camera.position = Vector3.Lerp(
      this.camera.position,
      this.defaultPosition,
      this.smoothingFactor
    )
    
    const currentTarget = this.camera.getTarget()
    const newTarget = Vector3.Lerp(currentTarget, this.defaultTarget, this.smoothingFactor)
    this.camera.setTarget(newTarget)
  }

  public getCamera(): FreeCamera {
    return this.camera
  }

  public setLimits(minZoom: number, maxZoom: number): void {
    this.minZoom = minZoom
    this.maxZoom = maxZoom
  }

  public setSmoothingFactor(factor: number): void {
    this.smoothingFactor = Math.max(0.01, Math.min(1, factor))
  }
}