import { Mesh, Scene, Vector3, AbstractMesh } from '@babylonjs/core'
import { FighterData, FighterState, MoveData } from './types'
import { PhysicsSystem } from '@lunchtime-smash/systems'

export class Fighter {
  private fighterData: FighterData
  private mesh: Mesh
  private scene: Scene
  private physicsSystem: PhysicsSystem
  private state: FighterState
  private frameTimer: number = 0

  constructor(
    fighterData: FighterData,
    mesh: Mesh,
    scene: Scene,
    physicsSystem: PhysicsSystem,
    playerId: number
  ) {
    this.fighterData = fighterData
    this.mesh = mesh
    this.scene = scene
    this.physicsSystem = physicsSystem
    this.state = {
      playerId,
      damage: 0,
      stocks: 3,
      position: mesh.position.clone(),
      velocity: Vector3.Zero(),
      facing: 'right',
      frameData: {
        currentFrame: 0,
        totalFrames: 0,
        canCancel: false,
        invulnerable: false
      },
      status: 'idle'
    }

    this.setupPhysics()
  }

  private setupPhysics(): void {
    this.physicsSystem.createCharacterPhysics(this.mesh, this.fighterData.stats.weight)
  }

  public executeMove(moveName: string): boolean {
    if (!this.canAct()) return false

    const move = this.fighterData.moves[moveName]
    if (!move) return false

    this.state.currentMove = moveName
    this.state.status = 'attacking'
    this.state.frameData = {
      currentFrame: 0,
      totalFrames: move.startupFrames + move.activeFrames + move.recoveryFrames,
      canCancel: false,
      invulnerable: false
    }
    this.frameTimer = 0

    return true
  }

  public update(deltaTime: number): void {
    this.frameTimer += deltaTime
    const frameRate = 60 // Target 60 FPS
    const frameTime = 1000 / frameRate

    // Update frame data if in an attack
    if (this.state.currentMove && this.frameTimer >= frameTime) {
      this.state.frameData.currentFrame++
      this.frameTimer = 0

      if (this.state.frameData.currentFrame >= this.state.frameData.totalFrames) {
        this.endCurrentMove()
      } else {
        this.updateMoveState()
      }
    }

    // Update position from physics
    this.state.position = this.mesh.position.clone()
    if (this.mesh.physicsImpostor) {
      const velocity = this.mesh.physicsImpostor.getLinearVelocity()
      if (velocity) {
        this.state.velocity = velocity
      }
    }

    // Check for blast zone
    if (this.physicsSystem.checkBlastZones(this.mesh)) {
      this.handleKO()
    }
  }

  private updateMoveState(): void {
    if (!this.state.currentMove) return

    const move = this.fighterData.moves[this.state.currentMove]
    const currentFrame = this.state.frameData.currentFrame

    // Update frame data properties
    if (currentFrame < move.startupFrames) {
      this.state.frameData.canCancel = false
      this.state.frameData.invulnerable = false
    } else if (currentFrame < move.startupFrames + move.activeFrames) {
      this.state.frameData.canCancel = true
      this.state.frameData.invulnerable = move.type === 'special'
    } else {
      this.state.frameData.canCancel = false
      this.state.frameData.invulnerable = false
    }
  }

  private endCurrentMove(): void {
    this.state.currentMove = undefined
    this.state.status = 'idle'
    this.state.frameData = {
      currentFrame: 0,
      totalFrames: 0,
      canCancel: false,
      invulnerable: false
    }
  }

  public move(direction: Vector3): void {
    if (!this.canMove()) return

    const force = this.fighterData.stats.speed
    this.physicsSystem.applyMovement(this.mesh, direction, force)

    // Update facing direction
    if (direction.x > 0) {
      this.state.facing = 'right'
    } else if (direction.x < 0) {
      this.state.facing = 'left'
    }

    this.state.status = 'moving'
  }

  public jump(): boolean {
    if (!this.canAct()) return false

    const jumpForce = this.fighterData.stats.jumpHeight
    const success = this.physicsSystem.jump(this.mesh, jumpForce)
    if (success) {
      this.state.status = 'falling'
    }
    return success
  }

  public shield(): void {
    if (!this.canAct()) return
    this.state.status = 'shielding'
  }

  public dodge(): void {
    if (!this.canAct()) return
    this.state.status = 'dodging'
    // TODO: Implement dodge invulnerability frames
  }

  public fastFall(): void {
    if (this.state.status === 'falling') {
      this.physicsSystem.fastFall(this.mesh)
    }
  }

  public takeDamage(damage: number, knockback: Vector3): void {
    this.state.damage += damage
    this.physicsSystem.applyKnockback(this.mesh, this.state.damage, knockback)
    this.state.status = 'stunned'
  }

  public respawn(position: Vector3): void {
    this.state.damage = 0
    this.state.status = 'idle'
    this.physicsSystem.respawnCharacter(this.mesh, position)
  }

  private handleKO(): void {
    this.state.stocks--
    if (this.state.stocks > 0) {
      // Respawn at center stage
      this.respawn(new Vector3(0, 5, 0))
    }
  }

  private canAct(): boolean {
    return this.state.status === 'idle' || this.state.status === 'moving'
  }

  private canMove(): boolean {
    return this.state.status !== 'attacking' && this.state.status !== 'stunned'
  }

  // Getters
  public getFighterData(): FighterData {
    return this.fighterData
  }

  public getState(): FighterState {
    return { ...this.state }
  }

  public getMesh(): Mesh {
    return this.mesh
  }

  public getDamage(): number {
    return this.state.damage
  }

  public getStocks(): number {
    return this.state.stocks
  }

  public getPosition(): Vector3 {
    return this.state.position.clone()
  }

  public getPlayerId(): number {
    return this.state.playerId
  }
}