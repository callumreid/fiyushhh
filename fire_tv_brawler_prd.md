
# Fire TV Brawler (“Lunchtime Smash”) – Product Requirements Document

---

## 1. Elevator Pitch
**Build a fast, four‑player couch‑competitive platform‑fighter for Amazon Fire TV Stick 4K Max, developed in TypeScript with Babylon.js and React, delivering Smash‑style thrills in lunchtime‑friendly 3‑stock matches.**  
Players pick one of eight quirky characters (e.g., *Alex Trebek*, *Cholo Pikachu*) and battle on five simple stages at 60 FPS (target; 30 FPS acceptable fallback). The game runs in‑browser for rapid iteration and deploys to Fire TV as an HTML5/WebGL app with gamepad, keyboard, and remote support.

---

## 2. Problem Statement
*Office gamers* lack a polished, low‑latency, local‑multiplayer brawler on Fire TV. Existing titles skew toward party quizzes (Jackbox) or sandbox builders (Minecraft) and fail to scratch the quick‑fire competitive itch of daily lunch sessions.  
Our coworkers (ages 18‑40) need a **responsive, Smash‑like arena fighter** they can launch instantly on the shared TV, using controllers they already own.

---

## 3. Goals & Non‑Goals
### Primary Goals
| ID | Goal |
|----|------|
| G‑1 | Ship an MVP supporting up to four local players at ≥30 FPS on Fire TV Stick 4K Max. |
| G‑2 | Provide eight selectable fighters **with full Smash‑style move‑sets** (tilts, aerials, smash attacks, specials, grab, shield/dodge). |
| G‑3 | Offer five distinct stages, each sized to keep all fighters on‑screen via dynamic camera zoom. |
| G‑4 | Support input from: Bluetooth HID gamepads, keyboard (for browser dev), and Fire TV remote (solo demo). |
| G‑5 | Fixed button map for MVP; basic pause menu and end‑of‑match results screen. |

### Secondary Goals
- Modular asset pipeline so artists can swap placeholder art/audio post‑MVP.
- Expose simple configuration for controller remapping (post‑MVP).

### Non‑Goals
- Online multiplayer or rollback netcode.
- Advanced items, hazards, story mode, or ranked matchmaking.
- Licensing real IP for public release.

---

## 4. Target Audience & Personas
### Persona 1 – “Competitive Coworker Carl”
*Age 29, Front‑end Dev*  
- Plays Smash Ultimate daily at home.  
- Brings personal 8BitDo controller to the office.  
- Cares about responsive controls & move depth.

### Persona 2 – “Casual Lunch‑Raider Lena”
*Age 34, PM*  
- Joins matches to unwind; okay with losing but loves big KO moments.  
- Uses Fire TV remote when no controller free.  
- Wants simple onboarding and readable UI.

### Persona 3 – “QA Quentin”
*Age 23, Intern*  
- Runs latest build in the browser; keyboard only.  
- Reports bugs & perf issues; needs deterministic repro steps.

---

## 5. Functional Requirements

### 5.1 Gameplay Mechanics
| US‑ID | User Story | Acceptance Criteria |
|-------|-----------|---------------------|
| US‑1 | *As a player*, I can select one of **8 characters** before a match. | Character carousel shows portraits & stats; selectable via d‑pad / left‑stick. |
| US‑2 | *As four players*, we can battle in **3‑stock free‑for‑all**; last player standing wins. | Stocks displayed under HUD; game ends when ≤1 stock remains. |
| US‑3 | *As a fighter*, I have **light, special, smash, tilt, aerial, grab, shield, dodge** mapped to fixed buttons. | Input buffer ≤1 frame; move executes with correct animation & hitboxes. |
| US‑4 | *As a viewer*, I see a **dynamic side‑view camera** that pans/zooms to keep all fighters visible. | No fighter exits viewport outside blast‑zone boundaries. |
| US‑5 | *As a player*, when my damage % increases, knockback scales; I am KO’d when crossing blast‑zone. | Damage counter increments; velocity = base + percent*multiplier. |
| US‑6 | *As any participant*, I can **pause** and access Resume / Quit options. | Game state freezes; HUD overlay appears. |
| US‑7 | *After a match*, we see a **results screen** listing winner, KOs, falls, damage dealt. | Data persists until “Continue” pressed. |

### 5.2 Stages
| STG‑ID | Stage Name | Layout Summary |
|--------|------------|----------------|
| ST‑1 | “Office Rooftop” | Flat base + 3 small platforms. |
| ST‑2 | “Cow Pasture” | Slightly slanted terrain, 2 side platforms. |
| ST‑3 | “Game Show Set” | Flat, no platforms – Final‑Destination style. |
| ST‑4 | “Bird Clouds” | Single tall center platform; lower blast‑zone. |
| ST‑5 | “Neon Night” | Two moving side platforms (slow, linear). |

### 5.3 Input & Controls
| Device | Mapping |
|--------|---------|
| Gamepad (Xbox / Switch‑Pro) | A = light, B = special, X = jump, Y = grab, LB/RB = shield/dodge, Start = pause |
| Keyboard (Browser) | Arrow = move, Z = jump, X = light, C = special, A = grab, S = shield, Enter = pause |
| Fire TV Remote | D‑pad = move, Center = light, Play/Pause = jump, Menu = pause (1‑player demo only) |

### 5.4 UI / UX
- Title screen → character select → stage select → match → results → loop.  
- Minimalist, high‑contrast HUD (damage %, stocks, player tags, timer).  
- Audio: CC‑licensed SFX; simple background loops per stage.

### 5.5 Asset Strategy
- **Placeholder models**: Low‑poly FBX/GLB with vertex colors.  
- **Sprite VFX**: Babylon.js ParticleSystem for hitsparks.  
- Replaceable via `/assets/{characters|stages}` directories.

### 5.6 LLM & Generative AI Integrations (Post‑MVP)
| Use‑Case | Service | Notes |
|----------|---------|-------|
| Dynamic taunt quips | GPT‑4o (streamed) | “/taunt” button triggers one‑liner. |
| Procedural stage concept art | fal.ai image endpoint | Dev‑only tool for rapid mockups. |

---

## 6. Non‑Functional Requirements
| Category | Requirement |
|----------|-------------|
| Performance | 60 FPS target, 30 FPS minimum on Fire TV Stick 4K Max (GPU: IMG GE8300, WebGL 2). |
| Latency | Input‑to‑action ≤50 ms. |
| Memory | ≤1.5 GB peak RAM. |
| File Size | ≤150 MB APK/ZIP (sideload). |
| Accessibility | Color‑blind‑safe palettes; subtitles off by default. |
| Security | No network permissions (local only). |
| Localization | EN‑US only for MVP. |

---

## 7. Technical Approach

### 7.1 Stack Selection
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Engine | **Babylon.js 5.x** | Mature TS API, WebGL 2 support, physics plug‑ins, React bindings. |
| Framework | React 18 + Vite | Fast HMR, TS out‑of‑the‑box, modular components. |
| Packaging | Amazon Web App (HTML5) via **Web App Tester** → Fire TV store. |
| Physics | Ammo.js (Babylon plugin) simplified 2‑D constraints. |
| Build | Yarn workspaces; ESLint + Prettier (no semicolons per team pref). |
| CI | GitHub Actions with Fire TV sideload artifact. |

### 7.2 Codebase Layout
```
/packages
  /engine      ← Babylon scene + systems
  /characters  ← One folder per fighter (model, anims, JSON stats)
  /stages
  /ui
  /input
  /game-core   ← State machine, stocks, damage calc
/apps
  /web         ← React front‑end
  /firetv      ← Wrapper manifest, assets
```
*Rule‑of‑thumb: one PR per package to minimize merge conflicts.*

---

## 8. Milestones & Timeline
| # | Milestone | Duration | Key Deliverables | Acceptance Criteria |
|---|-----------|----------|------------------|--------------------|
| M0 | **Project Bootstrap** | 1 wk | Repo, Babylon + React boilerplate, one test scene | App launches in browser & Fire TV, blank cube renders at 60 FPS. |
| M1 | **Input & Camera Core** | 2 wks | Controller/keyboard/remote mapping, dynamic camera rig | Four gamepads move four colored cubes; zoom keeps all visible. |
| M2 | **Combat Prototype** | 3 wks | Damage %, knockback physics, KO detection, stock HUD | Two test fighters can KO each other; match ends correctly. |
| M3 | **Character & Stage Pipeline** | 2 wks | Asset loader with hot‑swap, basic VFX, 5 placeholder stages | Designer can drop GLB into `/characters` and see in‑game. |
| M4 | **Full Move‑Set Implementation** | 3 wks | Light/special/tilt/aerial/smash, grab, shield, dodge | All eight fighters with unique frame data & hitboxes. |
| M5 | **Menus & UX Polish** | 1 wk | Title, character/stage select, pause, results | End‑to‑end happy path, no console errors. |
| M6 | **Performance Hardening** | 1 wk | Profiler passes, asset compression, GC tuning | Sustained 60 FPS on Stick 4K Max; ≤1.3 GB RAM. |
| M7 | **Beta Playtest** | 1 wk | Internal build, bug tracker triage | ≥90 min crash‑free session with 4 players. |
| M8 | **Release Candidate** | 1 wk | Final art/audio drop, versioning, Amazon submission | App passes Fire TV Web App checklist. |

---

## 9. Acceptance Criteria (MVP)
- [ ] Launches on Fire TV Stick 4K Max and Chrome desktop.
- [ ] Supports 1‑4 players local; hot‑plug detection.
- [ ] At least eight fighters selectable; each move functions per design doc.
- [ ] Five stages selectable; camera keeps all fighters on‑screen.
- [ ] Stable ≥30 FPS during four‑player match.
- [ ] Pause menu and results screen operate without soft lock.
- [ ] No hard‑coded asset paths; placeholders replaceable.
- [ ] README explains dev setup ≤10 min.

---

## 10. Metrics
| KPI | Target |
|-----|--------|
| Average FPS (4‑player match) | ≥55 |
| Mean input latency | ≤40 ms |
| Crash‑free sessions (≥10 min) | ≥99 % |
| Bundle size | ≤150 MB |

---

## 11. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WebGL perf bottlenecks on Stick 4K Max | Medium | High | Use mesh instancing, freeze materials, static batching. |
| Controller mapping edge‑cases | High | Medium | Include mapping JSON & fallback prompts. |
| Scope creep in move‑set depth | High | Medium | Lock frame‑data spreadsheet at M2; changes require PM review. |
| Asset swap pipeline delays | Medium | Low | Maintain strict `/assets` contract & CI lint. |

---

## 12. Open Questions / Future Work
1. Should we add simple AI bots for fewer than four humans?  
2. Will artists adopt PlayCanvas editor for in‑browser scene tweaks post‑MVP?  
3. Do we need accessibility options like remappable controls earlier?  

---

## 13. Glossary
| Term | Definition |
|------|------------|
| **Platform Fighter** | Fighting sub‑genre where players knock opponents off stage (e.g., Smash Bros.). |
| **Babylon.js** | Open‑source WebGL engine with TypeScript API. |
| **Stock** | A life in Smash; players lose a stock on KO. |
| **Blast‑zone** | Invisible bounds beyond which a fighter is KO’d. |

---

*Document version 1.0 – 2025‑07‑09.*  
