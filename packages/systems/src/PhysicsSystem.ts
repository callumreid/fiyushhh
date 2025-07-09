import { Scene, Vector3, Mesh, PhysicsImpostor, CannonJSPlugin } from '@babylonjs/core'

export interface CollisionData {
  meshA: Mesh
  meshB: Mesh
  point: Vector3
  normal: Vector3
}

export interface DamageData {
  attackerId: number
  victimId: number
  damage: number
  knockback: Vector3
  hitType: 'light' | 'special' | 'smash'
}

export class PhysicsSystem {
  private scene: Scene
  private gravityStrength = -20
  private blastZones = {
    left: -45,
    right: 45,
    top: 30,
    bottom: -20
  }

  constructor(scene: Scene) {
    this.scene = scene
    this.initializePhysics()
  }

  private initializePhysics(): void {
    // Use simplified physics for 2D-style movement
    this.scene.enablePhysics(new Vector3(0, this.gravityStrength, 0), new CannonJSPlugin())
  }

  public createCharacterPhysics(mesh: Mesh, mass: number = 1): void {
    mesh.physicsImpostor = new PhysicsImpostor(
      mesh,
      PhysicsImpostor.BoxImpostor,
      { mass, restitution: 0.1, friction: 0.5 },
      this.scene
    )

    // Prevent rotation on X and Z axes (2D-style movement)
    if (mesh.physicsImpostor) {
      mesh.physicsImpostor.setAngularVelocity(Vector3.Zero())
      mesh.physicsImpostor.physicsBody.fixedRotation = true
    }
  }

  public createStagePhysics(mesh: Mesh): void {
    mesh.physicsImpostor = new PhysicsImpostor(
      mesh,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.3, friction: 0.8 },
      this.scene
    )
  }

  public applyKnockback(mesh: Mesh, damage: number, baseKnockback: Vector3): void {
    if (!mesh.physicsImpostor) return

    // Calculate knockback based on damage percentage (Smash-style)
    const damageMultiplier = 1 + (damage / 100)
    const knockbackForce = baseKnockback.scale(damageMultiplier)

    // Apply impulse
    mesh.physicsImpostor.applyImpulse(knockbackForce, mesh.getAbsolutePosition())
  }

  public applyMovement(mesh: Mesh, direction: Vector3, force: number): void {
    if (!mesh.physicsImpostor) return

    // Apply horizontal movement force
    const movementForce = new Vector3(direction.x * force, 0, 0)
    mesh.physicsImpostor.applyImpulse(movementForce, mesh.getAbsolutePosition())

    // Limit maximum horizontal velocity
    const velocity = mesh.physicsImpostor.getLinearVelocity()
    if (velocity) {
      const maxHorizontalSpeed = 15
      if (Math.abs(velocity.x) > maxHorizontalSpeed) {
        velocity.x = Math.sign(velocity.x) * maxHorizontalSpeed
        mesh.physicsImpostor.setLinearVelocity(velocity)
      }
    }
  }

  public jump(mesh: Mesh, jumpForce: number): boolean {
    if (!mesh.physicsImpostor) return false

    // Check if character is grounded (simple ground check)
    const velocity = mesh.physicsImpostor.getLinearVelocity()
    if (!velocity || Math.abs(velocity.y) > 0.1) return false // Already in air

    // Apply jump impulse
    const jumpImpulse = new Vector3(0, jumpForce, 0)
    mesh.physicsImpostor.applyImpulse(jumpImpulse, mesh.getAbsolutePosition())
    return true
  }

  public fastFall(mesh: Mesh): void {
    if (!mesh.physicsImpostor) return

    const velocity = mesh.physicsImpostor.getLinearVelocity()
    if (velocity && velocity.y < 0) {
      // Increase downward velocity by 50%
      velocity.y *= 1.5
      mesh.physicsImpostor.setLinearVelocity(velocity)
    }
  }

  public checkBlastZones(mesh: Mesh): boolean {
    const position = mesh.getAbsolutePosition()
    
    return (
      position.x < this.blastZones.left ||
      position.x > this.blastZones.right ||
      position.y > this.blastZones.top ||
      position.y < this.blastZones.bottom
    )
  }

  public respawnCharacter(mesh: Mesh, spawnPosition: Vector3): void {
    if (!mesh.physicsImpostor) return

    // Reset position and velocity
    mesh.setAbsolutePosition(spawnPosition)
    mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
    mesh.physicsImpostor.setAngularVelocity(Vector3.Zero())
  }

  public setBlastZones(left: number, right: number, top: number, bottom: number): void {
    this.blastZones = { left, right, top, bottom }
  }

  public getBlastZones() {
    return { ...this.blastZones }
  }

  public calculateKnockback(
    basePower: number,
    damage: number,
    weight: number,
    hitAngle: number
  ): Vector3 {
    // Smash-style knockback calculation
    const scaling = (damage + basePower) * (1 + damage / 100) / weight
    const radians = (hitAngle * Math.PI) / 180
    
    return new Vector3(
      Math.cos(radians) * scaling,
      Math.sin(radians) * scaling,
      0
    )
  }

  public dispose(): void {
    this.scene.disablePhysicsEngine()
  }
}