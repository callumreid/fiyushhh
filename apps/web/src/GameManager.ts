import { Scene, Engine, Vector3 } from '@babylonjs/core'
import { GameState, MatchManager, GameStateType } from '@lunchtime-smash/game-core'
import { InputSystem, CameraSystem, PhysicsSystem, ActionType } from '@lunchtime-smash/systems'
import { FighterLoader, Fighter, ALL_FIGHTERS } from '@lunchtime-smash/fighters'
import { StageLoader, Stage, ALL_STAGES } from '@lunchtime-smash/stages'

export class GameManager {
  private scene: Scene
  private engine: Engine
  private gameState: GameState
  private matchManager: MatchManager
  private inputSystem: InputSystem
  private cameraSystem: CameraSystem
  private physicsSystem: PhysicsSystem
  private fighterLoader: FighterLoader
  private stageLoader: StageLoader
  
  private fighters: Fighter[] = []
  private currentStage: Stage | null = null
  private isRunning = false
  private lastUpdateTime = 0

  // Game settings from UI
  private characterSelections: { playerId: number; fighterId: string }[] = []
  private selectedStageId = 'office-rooftop'

  constructor(scene: Scene, engine: Engine, canvas: HTMLCanvasElement) {
    this.scene = scene
    this.engine = engine
    this.gameState = new GameState()
    this.matchManager = new MatchManager(this.gameState)
    
    // Initialize systems
    this.physicsSystem = new PhysicsSystem(scene)
    this.inputSystem = new InputSystem()
    this.cameraSystem = new CameraSystem(scene, canvas)
    this.fighterLoader = new FighterLoader(scene, this.physicsSystem)
    this.stageLoader = new StageLoader(scene, this.physicsSystem)

    this.setupInputHandlers()
  }

  private setupInputHandlers(): void {
    // Movement
    this.inputSystem.onAction(ActionType.MOVE_LEFT, (action) => {
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.move(new Vector3(-1, 0, 0))
      }
    })

    this.inputSystem.onAction(ActionType.MOVE_RIGHT, (action) => {
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.move(new Vector3(1, 0, 0))
      }
    })

    // Attacks
    this.inputSystem.onAction(ActionType.LIGHT, (action) => {
      if (!action.pressed) return
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.executeMove('light')
      }
    })

    this.inputSystem.onAction(ActionType.SPECIAL, (action) => {
      if (!action.pressed) return
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.executeMove('special')
      }
    })

    this.inputSystem.onAction(ActionType.JUMP, (action) => {
      if (!action.pressed) return
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.jump()
      }
    })

    this.inputSystem.onAction(ActionType.GRAB, (action) => {
      if (!action.pressed) return
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.executeMove('grab')
      }
    })

    this.inputSystem.onAction(ActionType.SHIELD, (action) => {
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        if (action.pressed) {
          fighter.shield()
        }
      }
    })

    this.inputSystem.onAction(ActionType.DODGE, (action) => {
      if (!action.pressed) return
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.dodge()
      }
    })

    // Fast fall
    this.inputSystem.onAction(ActionType.MOVE_DOWN, (action) => {
      const fighter = this.getFighterByPlayerId(action.playerId)
      if (fighter && this.gameState.getCurrentState() === GameStateType.MATCH) {
        fighter.fastFall()
      }
    })

    // Pause
    this.inputSystem.onAction(ActionType.PAUSE, (action) => {
      if (!action.pressed) return
      if (this.gameState.getCurrentState() === GameStateType.MATCH) {
        this.matchManager.pause()
      } else if (this.gameState.getCurrentState() === GameStateType.PAUSE) {
        this.matchManager.resume()
      }
    })
  }

  public handleStateChange(newState: GameStateType, data?: any): void {
    console.log(`State change: ${this.gameState.getCurrentState()} -> ${newState}`)
    
    switch (newState) {
      case GameStateType.CHARACTER_SELECT:
        this.gameState.setState(newState)
        break

      case GameStateType.STAGE_SELECT:
        if (data?.characterSelections) {
          this.characterSelections = data.characterSelections
        }
        this.gameState.setState(newState)
        break

      case GameStateType.MATCH:
        if (data?.selectedStage) {
          this.selectedStageId = data.selectedStage
        }
        this.startMatch()
        break

      case GameStateType.PAUSE:
        this.gameState.setState(newState)
        break

      case GameStateType.MENU:
        this.cleanupMatch()
        this.gameState.setState(newState)
        break

      default:
        this.gameState.setState(newState)
    }
  }

  private async startMatch(): Promise<void> {
    try {
      this.cleanupMatch()
      
      // Load stage
      const stageData = ALL_STAGES[this.selectedStageId]
      if (!stageData) {
        throw new Error(`Stage not found: ${this.selectedStageId}`)
      }
      
      this.currentStage = await this.stageLoader.loadStage(stageData)
      
      // Create fighters
      const spawnPoints = this.currentStage.getSpawnPoints()
      const playerColors = this.fighterLoader.getPlayerColors()
      
      this.fighters = []
      for (const selection of this.characterSelections) {
        const fighterData = ALL_FIGHTERS[selection.fighterId]
        if (!fighterData) continue
        
        const spawnPoint = spawnPoints[selection.playerId] || spawnPoints[0]
        const color = playerColors[selection.playerId] || playerColors[0]
        
        const fighter = await this.fighterLoader.loadFighter(
          fighterData,
          selection.playerId,
          spawnPoint,
          color
        )
        
        this.fighters.push(fighter)
        
        // Add to game state
        this.gameState.addPlayer(selection.fighterId, `player-${selection.playerId}`)
        
        // Add to camera tracking
        this.cameraSystem.addTarget({
          position: fighter.getPosition(),
          playerId: selection.playerId
        })
      }
      
      // Start match
      this.matchManager.startMatch()
      this.gameState.setState(GameStateType.MATCH)
      this.isRunning = true
      
      console.log(`Match started with ${this.fighters.length} fighters on ${stageData.name}`)
      
    } catch (error) {
      console.error('Failed to start match:', error)
    }
  }

  private cleanupMatch(): void {
    this.isRunning = false
    
    // Dispose fighters
    this.fighters.forEach(fighter => {
      fighter.getMesh().dispose()
    })
    this.fighters = []
    
    // Dispose stage
    if (this.currentStage) {
      this.currentStage.dispose()
      this.currentStage = null
    }
    
    // Reset game state
    this.gameState.reset()
  }

  public update(): void {
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    if (!this.isRunning || this.gameState.getCurrentState() !== GameStateType.MATCH) {
      return
    }

    // Update fighters
    this.fighters.forEach(fighter => {
      fighter.update(deltaTime)
      
      // Update camera target
      this.cameraSystem.addTarget({
        position: fighter.getPosition(),
        playerId: fighter.getPlayerId()
      })
      
      // Check for KO
      if (this.physicsSystem.checkBlastZones(fighter.getMesh())) {
        this.handleFighterKO(fighter)
      }
    })

    // Update stage
    if (this.currentStage) {
      this.currentStage.update(deltaTime)
    }

    // Update camera
    this.cameraSystem.update()

    // Check for match end
    this.checkMatchEnd()
  }

  private handleFighterKO(fighter: Fighter): void {
    const playerId = fighter.getPlayerId()
    
    // Handle stock loss
    this.matchManager.handleKO(playerId)
    
    // Respawn if has stocks
    const updatedPlayer = this.gameState.getPlayers().find(p => p.id === playerId)
    if (updatedPlayer && updatedPlayer.stocks > 0) {
      const spawnPoints = this.currentStage?.getSpawnPoints() || [new Vector3(0, 5, 0)]
      const spawnPoint = spawnPoints[playerId] || spawnPoints[0]
      fighter.respawn(spawnPoint)
    }
  }

  private checkMatchEnd(): void {
    const players = this.gameState.getPlayers()
    const alivePlayers = players.filter(p => p.stocks > 0)
    
    if (alivePlayers.length <= 1) {
      this.endMatch()
    }
  }

  private endMatch(): void {
    this.isRunning = false
    this.gameState.setState(GameStateType.RESULTS)
  }

  private getFighterByPlayerId(playerId: number): Fighter | undefined {
    return this.fighters.find(f => f.getPlayerId() === playerId)
  }

  // Getters for UI
  public getGameState(): GameState {
    return this.gameState
  }

  public getMatchManager(): MatchManager {
    return this.matchManager
  }

  public getFighters(): Fighter[] {
    return [...this.fighters]
  }

  public dispose(): void {
    this.cleanupMatch()
    this.inputSystem.dispose()
    this.physicsSystem.dispose()
    this.fighterLoader.dispose()
    this.stageLoader.dispose()
  }
}