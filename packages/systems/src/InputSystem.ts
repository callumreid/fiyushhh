export enum InputType {
  GAMEPAD = 'GAMEPAD',
  KEYBOARD = 'KEYBOARD',
  REMOTE = 'REMOTE'
}

export enum ActionType {
  LIGHT = 'LIGHT',
  SPECIAL = 'SPECIAL',
  JUMP = 'JUMP',
  GRAB = 'GRAB',
  SHIELD = 'SHIELD',
  DODGE = 'DODGE',
  PAUSE = 'PAUSE',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

export interface InputDevice {
  id: string
  type: InputType
  connected: boolean
  playerId?: number
}

export interface InputAction {
  type: ActionType
  playerId: number
  pressed: boolean
  timestamp: number
  value?: number // For analog inputs
}

export class InputSystem {
  private devices: Map<string, InputDevice> = new Map()
  private actionCallbacks: Map<ActionType, ((action: InputAction) => void)[]> = new Map()
  private keyboardState: Map<string, boolean> = new Map()
  private gamepadPollingInterval: number | null = null

  constructor() {
    this.setupKeyboardListeners()
    this.setupGamepadListeners()
    this.startGamepadPolling()
  }

  private setupKeyboardListeners(): void {
    // Register keyboard as input device
    const keyboardDevice: InputDevice = {
      id: 'keyboard',
      type: InputType.KEYBOARD,
      connected: true,
      playerId: 0
    }
    this.devices.set('keyboard', keyboardDevice)

    document.addEventListener('keydown', (event) => {
      if (this.keyboardState.get(event.code)) return // Prevent key repeat

      this.keyboardState.set(event.code, true)
      const action = this.mapKeyboardInput(event.code, true)
      if (action) {
        this.triggerAction(action)
      }
    })

    document.addEventListener('keyup', (event) => {
      this.keyboardState.set(event.code, false)
      const action = this.mapKeyboardInput(event.code, false)
      if (action) {
        this.triggerAction(action)
      }
    })
  }

  private setupGamepadListeners(): void {
    window.addEventListener('gamepadconnected', (event) => {
      const gamepad = event.gamepad
      const device: InputDevice = {
        id: `gamepad-${gamepad.index}`,
        type: InputType.GAMEPAD,
        connected: true,
        playerId: gamepad.index
      }
      this.devices.set(device.id, device)
      console.log(`Gamepad connected: ${gamepad.id}`)
    })

    window.addEventListener('gamepaddisconnected', (event) => {
      const deviceId = `gamepad-${event.gamepad.index}`
      const device = this.devices.get(deviceId)
      if (device) {
        device.connected = false
        console.log(`Gamepad disconnected: ${event.gamepad.id}`)
      }
    })
  }

  private startGamepadPolling(): void {
    this.gamepadPollingInterval = window.setInterval(() => {
      const gamepads = navigator.getGamepads()
      
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i]
        if (!gamepad) continue

        const deviceId = `gamepad-${i}`
        const device = this.devices.get(deviceId)
        if (!device || !device.connected) continue

        this.processGamepadInput(gamepad, device)
      }
    }, 16) // ~60 FPS polling
  }

  private processGamepadInput(gamepad: Gamepad, device: InputDevice): void {
    // Process buttons
    const buttonMapping = this.getGamepadButtonMapping()
    
    gamepad.buttons.forEach((button, index) => {
      const actionType = buttonMapping.get(index)
      if (actionType && button.pressed) {
        const action: InputAction = {
          type: actionType,
          playerId: device.playerId!,
          pressed: true,
          timestamp: performance.now(),
          value: button.value
        }
        this.triggerAction(action)
      }
    })

    // Process analog sticks for movement
    const leftStick = {
      x: gamepad.axes[0] || 0,
      y: gamepad.axes[1] || 0
    }

    const deadzone = 0.15
    if (Math.abs(leftStick.x) > deadzone) {
      const actionType = leftStick.x > 0 ? ActionType.MOVE_RIGHT : ActionType.MOVE_LEFT
      const action: InputAction = {
        type: actionType,
        playerId: device.playerId!,
        pressed: true,
        timestamp: performance.now(),
        value: Math.abs(leftStick.x)
      }
      this.triggerAction(action)
    }

    if (Math.abs(leftStick.y) > deadzone) {
      const actionType = leftStick.y > 0 ? ActionType.MOVE_DOWN : ActionType.MOVE_UP
      const action: InputAction = {
        type: actionType,
        playerId: device.playerId!,
        pressed: true,
        timestamp: performance.now(),
        value: Math.abs(leftStick.y)
      }
      this.triggerAction(action)
    }
  }

  private mapKeyboardInput(code: string, pressed: boolean): InputAction | null {
    const keyMapping = new Map([
      ['KeyX', ActionType.LIGHT],
      ['KeyC', ActionType.SPECIAL],
      ['KeyZ', ActionType.JUMP],
      ['KeyA', ActionType.GRAB],
      ['KeyS', ActionType.SHIELD],
      ['KeyD', ActionType.DODGE],
      ['Enter', ActionType.PAUSE],
      ['ArrowLeft', ActionType.MOVE_LEFT],
      ['ArrowRight', ActionType.MOVE_RIGHT],
      ['ArrowUp', ActionType.MOVE_UP],
      ['ArrowDown', ActionType.MOVE_DOWN]
    ])

    const actionType = keyMapping.get(code)
    if (!actionType) return null

    return {
      type: actionType,
      playerId: 0, // Keyboard is always player 0
      pressed,
      timestamp: performance.now()
    }
  }

  private getGamepadButtonMapping(): Map<number, ActionType> {
    return new Map([
      [0, ActionType.LIGHT],    // A button
      [1, ActionType.SPECIAL],  // B button
      [2, ActionType.JUMP],     // X button
      [3, ActionType.GRAB],     // Y button
      [4, ActionType.SHIELD],   // LB
      [5, ActionType.SHIELD],   // RB
      [6, ActionType.DODGE],    // LT
      [7, ActionType.DODGE],    // RT
      [9, ActionType.PAUSE]     // Start button
    ])
  }

  private triggerAction(action: InputAction): void {
    const callbacks = this.actionCallbacks.get(action.type) || []
    callbacks.forEach(callback => callback(action))
  }

  public onAction(actionType: ActionType, callback: (action: InputAction) => void): void {
    if (!this.actionCallbacks.has(actionType)) {
      this.actionCallbacks.set(actionType, [])
    }
    this.actionCallbacks.get(actionType)!.push(callback)
  }

  public getConnectedDevices(): InputDevice[] {
    return Array.from(this.devices.values()).filter(device => device.connected)
  }

  public assignPlayerToDevice(deviceId: string, playerId: number): boolean {
    const device = this.devices.get(deviceId)
    if (device && device.connected) {
      device.playerId = playerId
      return true
    }
    return false
  }

  public dispose(): void {
    if (this.gamepadPollingInterval) {
      clearInterval(this.gamepadPollingInterval)
    }
    this.devices.clear()
    this.actionCallbacks.clear()
  }
}