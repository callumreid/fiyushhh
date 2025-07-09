# Lunchtime Smash

A fast-paced, four-player platform fighter for Amazon Fire TV Stick 4K Max. Built with TypeScript, Babylon.js, and React.

## Project Structure

```
/packages
  /game-core      ← State machine, stocks, damage calc
  /fighters       ← Character JSON + animations
  /stages         ← GLB + scene defs
  /systems        ← Input, Camera, Physics
  /ui             ← React components + HUD
/apps
  /web            ← Vite dev build
  /firetv         ← Amazon Web App wrapper
```

## Quick Start

1. Install dependencies: `yarn install`
2. Start development: `yarn dev`
3. Open browser to `http://localhost:5173`

## Controls

- **Gamepad**: A-Light, B-Special, X-Jump, Y-Grab, LB/RB-Shield, Start-Pause
- **Keyboard**: X-Light, C-Special, Z-Jump, A-Grab, S-Shield, Enter-Pause
- **Fire TV Remote**: OK-Light, Play-Jump, Menu-Pause (single-player test)

## Performance Targets

- 60 FPS target, 30 FPS minimum on Fire TV Stick 4K Max
- ≤40ms input-to-action latency
- Peak RAM ≤1.5GB
- Bundle size ≤150MB

## Development

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking
- `yarn test` - Run Jest tests

## Tech Stack

- **Engine**: Babylon.js 5.x
- **Framework**: React 18 + Vite
- **Physics**: Ammo.js (2D constraints)
- **Language**: TypeScript
- **Packaging**: Amazon Web App (HTML5)

## Milestones

- [x] M0: Project Bootstrap
- [ ] M1: Input & Camera Core
- [ ] M2: Combat Prototype
- [ ] M3: Character & Stage Pipeline
- [ ] M4: Full Move-Set Implementation
- [ ] M5: Menus & UX Polish
- [ ] M6: Performance Hardening
- [ ] M7: Beta Playtest
- [ ] M8: Release Candidate

## Characters

1. Alex Trebek - Balanced quizmaster
2. Cow - Heavy tank
3. Dr Shen - Technical swordsman
4. Next Coming of Christ - Floaty mage
5. Helicopter - Heavy zoner
6. Angry Turkey - Speedy glass-cannon
7. Two Babies w/ Two Knives - Dual-stance trickster
8. Two-Beer Muizz - Drunken brawler

## Stages

1. Office Rooftop - Flat stage
2. Game Show Set - Classic tri-platform
3. Cow Pasture - Dual side platforms
4. Neon Night - Tall center platform
5. Bird Clouds - Moving side platforms