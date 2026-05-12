# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Ghost Directive** — 3D top-down tactical stealth/strategy prototype. Plan in pause (PlanningMode), then press PLAY to run the plan in real time (ExecuteMode). The project is Sprint-driven (see `Documentation/IMPLEMENTATION_LOG.md` and `Documentation/SPRINT_*_GUIDE.md`). Owner-facing docs are in Spanish; code comments and debug logs are mostly in Spanish too — match that style when editing or adding logs.

- **Unity:** `6000.3.6f1` (exact — verify in `ProjectSettings/ProjectVersion.txt` if in doubt)
- **Render pipeline:** URP (`com.unity.render-pipelines.universal` 17.3.0)
- **Key packages:** `com.unity.ai.navigation` 2.0.9 (for `NavMeshLink`, imported via `using Unity.AI.Navigation;` — NOT `UnityEngine.AI`), `com.unity.cinemachine` 3.1.5, `com.unity.inputsystem` 1.18.0.
- **Single scene:** `Assets/Scenes/MainScene/MainScene.unity`.

## Build / run / test

This project is developed **inside the Unity Editor**. There is no headless CLI build pipeline, no test runner scripts, no lint config. Iteration is:

1. User opens the project in Unity 6000.3.6f1.
2. Scripts get compiled automatically on save. Check the Unity Console for errors.
3. User presses Play in `MainScene.unity` to test.

When making code changes, do not add `README`, `build.sh`, `Makefile`, or test harnesses unless explicitly asked — they don't fit the workflow. Verify changes by asking the user to run Play mode and report logs / behavior.

`com.unity.test-framework` is installed but there are no test assemblies in the repo.

## High-level architecture

### Namespace layout (mirrors `Assets/Scripts/` subfolders)

| Namespace | Folder | Role |
|---|---|---|
| `GhostDirective.Core` | `Scripts/Core` | Singletons (`GameManager`, `UnitManager`, `NoiseManager`), cross-cutting components (`SelectableObject`, `MouseGroundRaycast`, `GridVisualizer`, `SmoothLinkTraverser`, `HealthComponent`, `DamageVisualFeedback`), shared enums (`GameMode`, `NoiseType`, `SkillType`, `CommunicationType`). |
| `GhostDirective.CameraSystem` | `Scripts/Camera` | `CinemachineInputHandler` — all camera control (WASD pan, MMB rotate, Q/E, Shift/Ctrl height). |
| `GhostDirective.Units` | `Scripts/Units` | `PlayerUnit` (lógica container), `UnitMovement` (NavMeshAgent driver + waypoint following + action execution), `UnitState`, `DetectionFeedback`. |
| `GhostDirective.NPCs` | `Scripts/NPCs` | `GuardAI` (state machine: Patrol/Investigate/Chase/Alarm), `VisionSystem` (FOV/LOS cone), `SecurityCamera`, `GuardGateOpener` (guards breach gates/fences when chasing), enums `GuardState` + `AlertState` + `GuardAction` (Attack/Neutralize). |
| `GhostDirective.Buildings` | `Scripts/Buildings` | `BuildingCore` (health/state/NavMesh), `ActionData` (ScriptableObject for sabotage/hack/destroy), specific buildings (`AlarmPanel`, `CommCenter`), `InteractionPoint`, `FenceBuilder` (editor-time generator), `BuildingState` enum. |
| `GhostDirective.Planning` | `Scripts/Planning` | `PlanningTool`, `DragSelector`, `Waypoint`, `WaypointManager`. Only active in `GameMode.Planning`. |
| `GhostDirective.UI` | `Scripts/UI` | Debug UI, action popups, unit panel, waypoint tooltip. |
| `GhostDirective.*.Editor` | `Scripts/Editor` | `FenceBuilderEditor`, `GuardPatrolEditor`, `MigrateToVisionSystem` — must stay in `Scripts/Editor/` so Unity auto-excludes them from runtime builds. |

### Core runtime flow

- **`GameManager`** (singleton) owns a `GameMode` (`Planning` / `Execute` / `Result`) and fires `OnModeChanged`. Planning sets `Time.timeScale = 0`; Execute sets `Time.timeScale = _speedMultiplier` (default 1).
- **Speed multiplier system:** `GameManager.SetSpeedMultiplier(float)` changes `Time.timeScale` during Execute, affecting all `Time.deltaTime` users automatically (units, guards, AI, coroutines). Fires `OnSpeedMultiplierChanged` event. `DebugModeController` auto-creates ×1/×2/×4 buttons from code — visible only in Execute Mode.
- **Camera scripts** use `Time.unscaledDeltaTime` on purpose so the player can still orbit the map while `timeScale = 0` or at ×2/×4 speed. When adding any system that must run in Planning (UI, camera, input feedback), do the same. Gameplay systems (AI, units, physics) should use `Time.deltaTime` and will freeze in Planning, which is the intended design.
- **`UnitManager`** / **`NoiseManager`** are also singletons discovered via `FindFirstObjectByType` with lazy `GameObject` fallback — don't rely on scene wiring.

### Logic-vs-visual separation (project-wide rule)

Every gameplay GameObject follows this pattern:

```
ParentObject  (logic container — colliders, Rigidbody, scripts, NavMeshAgent/Obstacle)
└── Visual child(ren)  (MeshRenderer, Animator, VFX)
```

Code reflects this: `SelectableObject`, `PlayerUnit`, `BuildingCore`, etc. all use `GetComponentsInChildren<Renderer>(true)` to recolor / hide / highlight. When adding a new selectable/building, keep the logic on the parent and put meshes on children — do NOT attach `MeshRenderer` to the parent. `Scripts/README.md` documents this in more detail.

### Building state / action pipeline

`ActionData` is a `ScriptableObject` (`CreateAssetMenu → GhostDirective/Action Data`) describing a sabotage/hack/destroy action: duration, noise level, required `SkillType`, `allowedWhenStates`, and `resultingState`. `UnitMovement` consumes it; `BuildingCore.ApplyAction` applies the resulting `BuildingState`.

`BuildingState` has six values. Two are load-bearing for Gate/Fence logic:
- **`Destroyed`** — building gone, swap to destroyed material, disable obstacle. Also triggers `ApplyDestructionRadius()` if `destructionRadius > 0`.
- **`Breached`** — ONLY for gates/fences (things with `destroyOnlyVisual` assigned). Hides the door leaf without changing materials, opens the passageway.
- **`Hacked`** — temporary or permanent. If `hackDuration > 0`, a countdown in `BuildingCore.Update()` reverts the building to `Normal` after that many seconds. If the building is destroyed while hacked, the timer is cancelled. Uses `hackedMaterial` (cyan fallback) distinct from `Sabotaged` (orange fallback).

### Destruction radius (BuildingCore)

`BuildingCore` has a `destructionRadius` field (default 0 = disabled). When a building enters `Destroyed` state, `ApplyDestructionRadius()` runs: it finds all `BuildingCore` and `SecurityCamera` objects within that radius and destroys them too. A static flag `_broadcastingDestruction` prevents infinite chain-reaction loops. Configure per-prefab in the Inspector — useful for explosive buildings or panels with mounted cameras.

### SecurityCamera destruction

`SecurityCamera.DestroyFromExplosion()` is the public entry point called by `BuildingCore.ApplyDestructionRadius()`. It disables the `SecurityCamera` and `VisionSystem` components (stops detection and rotation) and tints all child renderers black — the mesh stays in the scene as a destroyed prop. TODO: replace tint with destruction animation + destroyed-camera skin when assets are ready.

### Gate / Fence NavMesh bridging (important!)

The frame of a gate cuts the baked NavMesh into two disconnected islands even when the door's `NavMeshObstacle` is disabled. To let agents cross after `Breached` / `Destroyed`, `BuildingCore` auto-creates a `NavMeshLink` child (`_AutoNavMeshLink`) in `Awake` (via `EnsureNavMeshLink`), keeps it disabled, and enables it inside `RemoveObstacleSoUnitsCanPass` after tuning endpoints (`TuneNavMeshLinkEndpoints` samples the NavMesh on both sides to make the link symmetric). Width is driven by serialized fields in the `"NavMesh Link (Gate/Fence Traversal)"` header so Gate and Fence prefabs feel identical — tune those in the prefab Inspector, not in code.

`SmoothLinkTraverser` is the matching runtime piece on agents: it disables `NavMeshAgent.autoTraverseOffMeshLink` and manually walks across the link at a clamped speed, preventing the default teleport/stutter. `UnitMovement` and `GuardAI` auto-attach it in `Awake`, so new agent prefabs don't need to include it.

If a fence has `destroyOnlyVisual == null` (the breach target IS the GO itself), `RemoveObstacleSoUnitsCanPass` must NOT call `SetActive(false)` on the parent — that would kill the `NavMeshLink` child and any running coroutine. The code path disables renderers + colliders instead; preserve that when modifying.

### Guard AI & detection

`GuardAI` drives the state machine; `VisionSystem` does cone + LOS checks; `DetectionFeedback` shows the player a UI progress bar. Alarm panels and comm centers propagate alerts through `NoiseManager` + alert-related events. When adding new enemy behavior, extend `GuardState` / `AlertState` rather than adding parallel booleans.

`GuardAI.Awake()` forces `gameObject.layer = LayerMask.NameToLayer("NPC")` at runtime — scene instances may have layer 0 (Default) if placed before the layer was configured. `GuardAI.Start()` auto-adds `HealthComponent` if missing and subscribes `HandleGuardDeath` to `OnDied`.

### Health & damage system (HealthComponent + DamageVisualFeedback)

`HealthComponent` (`Scripts/Core/HealthComponent.cs`, GUID `d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9`) is a universal health script for every gameplay object. Key API:
- `SetMaxHealth(float, bool fillToMax)` — called by owners (GuardAI.Start, BuildingCore.Awake) to override the serialized `maxHealth`.
- `TakeDamage(float damage, GameObject attacker)` — apply damage; fires `OnDamageTaken`, `OnHealthChanged`, and on death `OnDied`.
- Events: `OnHealthChanged(float current, float max)`, `OnDied(GameObject attacker)`, `OnDamageTaken(float, GameObject)`.
- `HealthComponent.Awake()` auto-adds `DamageVisualFeedback` if not already present — **do not add it manually to prefabs**, it is handled in code.
- `destroyOnDeath` is `false` for all current gameplay objects (bodies stay in scene).

`DamageVisualFeedback` (`Scripts/Core/DamageVisualFeedback.cs`, GUID `e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0`) provides:
- **Punch scale flash** on damage (scales object 15% momentarily — avoids `_BaseColor` conflict with `SelectableObject` hover glow).
- **World-space health bar** (Canvas NOT parented to the object — lives at top-level and is followed via `LateUpdate.position`). This avoids inheriting the parent's non-uniform scale (e.g. guard scale `(1, 1.8, 1)` would otherwise push the bar 1.8× too high).
- Bar is hidden by default; appears on first damage; hides after `hideDelay` (3s) with no further damage.
- Background of the bar flashes red on damage for additional feedback.

**HP values (10 DPS pistol baseline):**
| Object | HP | Time to kill |
|---|---|---|
| Guard | 80 | ~8s |
| PlayerUnit | 120 | ~12s |
| SecurityCamera | 30 | ~3s |
| Gate | 250 | ~25s |
| FenceSegment | 80 | ~8s |
| AlarmPanel | 150 | ~15s |
| CommCenter | 400 | ~40s |
| FuelDepot | 600 | ~60s |
| PowerPlant | 1000 | ~100s |

### DPS-based actions (ActionData.isDamageAction)

`ActionData` now has `isDamageAction` (bool). When `true`, `UnitMovement.ExecuteAction()` uses a DPS loop (`TakeDamage(dps * Time.deltaTime)`) instead of a fixed-duration wait. `Action_Destroy.asset` has `isDamageAction: 1`. `BuildingCore.Awake()` subscribes `OnHealthDepleted` to `HealthComponent.OnDied`, which calls `SetState(BuildingState.Destroyed)`.

### Guard targeting (UnitMovement + PlanningTool)

- Right-click on a guard in Planning Mode → `ActionSelectionPopup.ShowGuardActions()` → shows "Atacar" / "Neutralizar". **Requires a unit to be selected first** — popup is suppressed if `_selectedUnits.Count == 0`.
- `Waypoint.SetAsGuardTarget(guard, action)` stores `isGuardTarget=true`, `isObjectTarget=true`, `targetObject=guard.gameObject`.
- During Execute, `UnitMovement.MoveToCurrentWaypoint()` sets `_trackedGuard` (a `GuardAI` ref) and updates `agent.SetDestination(guard.position)` each frame. Combat triggers when `Vector3.Distance <= Max(1.8f, stoppingDistance + 0.5f)`.
- `OnWaypointReached()` sets `_isPerformingAction = true` **before** `StartCoroutine(ExecuteGuardAction)` to prevent re-entry across frames.
- `ExecuteGuardAction` applies DPS each frame until `guardHealth.IsAlive == false`; Attack emits a Gunshot noise event; Neutralize is silent with 2× DPS.
- `UnitMovement.StartExecution()` clears `SetAsWaypointTarget(false)` on all waypoint targets so they stop glowing when execution begins.

### Layer collision rules

`GameManager.Awake()` calls `Physics.IgnoreLayerCollision("NPC", "PlayerUnit", true)` — guards and player units do not physically push each other (NavMeshAgent avoidance handles separation).

Layer numbers in use: `Ground` (6+7), `PlayerUnit` (8), `NPC` (9). Guards have their layer forced to NPC at runtime in `GuardAI.Awake()`.

### Hover detection (MouseGroundRaycast)

`UpdateHoverDetection()` uses an **unrestricted raycast** (no layer mask). It skips any hit on the `Ground` layer and then calls `GetComponentInParent<SelectableObject>()` on whatever it hit. This means guards glow on hover regardless of their actual Unity layer setting.

**Important:** During Execute mode, if the camera raycast hits a guard (unit is standing on top of it), `SelectableObject.SetHighlight()` runs every frame. Using `_BaseColor` in `MaterialPropertyBlock` for flash effects is immediately overridden — always use punch scale or other non-material approaches for damage flash.

## Conventions worth knowing

- Debug logging is intentionally verbose and prefixed with the component name, often with `-DIAG` tag for diagnostic output (e.g. `[BuildingCore-DIAG]`). Keep the same style when tracing new issues — the user reads these logs directly.
- Public methods get XML `<summary>` docs in Spanish. Private helpers usually get a block comment header.
- Enums live in their own file (`GuardState.cs`, `AlertState.cs`, `BuildingStates.cs`, etc.), not nested inside classes.
- New data-driven content is a `ScriptableObject` with `CreateAssetMenu` under the `GhostDirective/` menu root (see `ActionData`).
- Required layers referenced by scripts: `Ground`, `Building`, `PlayerUnit`, `NPC`. If something silently fails to raycast, check layer configuration first.
- **MaterialPropertyBlock color flash conflicts with SelectableObject:** `SelectableObject` applies `_BaseColor` via MaterialPropertyBlock every frame during hover/waypoint-target state. Any flash system that also uses `_BaseColor` will be overwritten immediately. Use transform scale punch or other non-material approaches instead.
- **Canvas parented to non-uniform scale objects:** A world-space Canvas child of an object with scale `(1, 1.8, 1)` will have its `localPosition.y` multiplied by 1.8, pushing it too high. Always parent health bar / UI canvases at the top level and update position via `LateUpdate` in world space.
- **Coroutine re-entry across frames:** `StartCoroutine()` schedules execution for the next frame. If a guard-arrival check in `Update()` triggers `OnWaypointReached()`, the coroutine hasn't started yet, so `_isPerformingAction` is still false — `Update()` can call `OnWaypointReached()` again the same frame. Always set `_isPerformingAction = true` **before** calling `StartCoroutine()`.
- **Prefab YAML editing:** Never edit a prefab without reading it first with the `Read` tool. When adding components via YAML, the component must appear in both the `m_Component` list AND have its own `--- !u!114 &fileID` MonoBehaviour block. The MonoBehaviour block's `m_Script` must reference the correct GUID from the script's `.meta` file.

## Key files created / modified (session log)

### New scripts
| File | GUID | Purpose |
|---|---|---|
| `Assets/Scripts/Core/HealthComponent.cs` | `d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9` | Universal HP system. Auto-adds DamageVisualFeedback in Awake. |
| `Assets/Scripts/Core/DamageVisualFeedback.cs` | `e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0` | Emission flash + progressive darkening + death black. Auto-added by HealthComponent. |
| `Assets/Scripts/NPCs/GuardAction.cs` | (auto) | Enum: `Attack`, `Neutralize`. |

### Modified scripts (key changes)
| File | What changed |
|---|---|
| `GameManager.cs` | `Awake()`: `Physics.IgnoreLayerCollision("NPC","PlayerUnit",true)` |
| `GuardAI.cs` | `Awake()`: forces layer to NPC. `Start()`: auto-adds HealthComponent (80 HP), subscribes `HandleGuardDeath → OnDied`. |
| `BuildingCore.cs` | `Awake()`: auto-adds HealthComponent with `maxHealth`, subscribes `OnHealthDepleted → SetState(Destroyed)`. `SetState(Destroyed)`: calls `DestroyFromExplosion()` on child SecurityCameras; Gate/Fence hides renderers instead of tinting black. `SetState(Breached)`: Gate/Fence also hides renderers. `UpdateVisualFeedback()`: early return for Destroyed (DamageVisualFeedback owns the black). `RemoveObstacleSoUnitsCanPass()`: no longer disables renderers. |
| `MouseGroundRaycast.cs` | `UpdateHoverDetection()`: unrestricted raycast, skips Ground layer, calls `GetComponentInParent<SelectableObject>()`. |
| `ActionData.cs` | Added `isDamageAction` bool + `damageTickInterval` float. `UnitMovement` uses tick-based DPS loop. |
| `Waypoint.cs` | Added `isGuardTarget`, `guardAction`, `SetAsGuardTarget(guard, action)`. |
| `ActionSelectionPopup.cs` | Added `ShowGuardActions()` + `CreateGuardActionButton()`. |
| `PlanningTool.cs` | Guard detection in `TryPlaceWaypoint()`; `ShowGuardActionPopup()` (requires unit selected); `OnGuardActionSelected()` creates guard waypoints. |
| `UnitMovement.cs` | Guard tracking + tick-based DPS loop (`attackTickInterval` field). `_isPerformingAction=true` set BEFORE `StartCoroutine`. `StartExecution()` clears waypoint target glows. Gunshot noise level 80. |
| `VisionSystem.cs` | `_isDestroyed` flag blocks all updates. `DestroyFOVPermanent()`: destroys `_fovContainer` GO + clears rays. `OnDisable/OnEnable`: hide/restore FOV. `UpdateVision/UpdateDetection/UpdateFOVVisual`: early return if `_isDestroyed`. |
| `SecurityCamera.cs` | Subscribes `HealthComponent.OnDied → OnHealthDepleted → DestroyFromExplosion()`. `DestroyFromExplosion()` calls `VisionSystem.DestroyFOVPermanent()` before disabling. |
| `NoiseManager.cs` | `maxNoiseRadius` 35m → 65m (weapon fire now reaches >50m). |

### Modified prefabs (HealthComponent HP)
All prefabs have `HealthComponent` (auto via `GuardAI`/`BuildingCore` code, or in YAML):
`Guard.prefab` (80), `PlayerUnit.prefab` (120), `SecurityCamera.prefab` (30), `Gate.prefab` (800), `FenceSegment.prefab` (300), `AlarmPanel.prefab` (150), `CommCenter.prefab` (400), `FuelDepot.prefab` (600), `PowerPlant.prefab` (1000).

### Modified assets
| File | Change |
|---|---|
| `Assets/ScriptableObjects/Actions/Action_Destroy.asset` | `isDamageAction: 1`, `damageTickInterval: 1` |
| `Assets/ScriptableObjects/Actions/Action_Breach.asset` | `noiseLevel: 15` (silent tool work, ~10m radius) |

### DamageVisualFeedback architecture (three independent channels)
```
HOVER   → SelectableObject  → _BaseColor via MPB        (no tocamos esto)
FLASH   → DamageVisualFeedback → _EmissionColor via MPB  (blanco en cada tick de daño)
DAÑO    → DamageVisualFeedback → mat.SetColor(_BaseColor) directamente en instancia
MUERTE  → DamageVisualFeedback → _BaseColor MPB negro permanente + SelectableObject off
```
- Flash captura materiales en `Start()` (no Awake) para evitar staling con BuildingCore.
- Gate/Fence con `disableMaterialChanges=true`: renderers deshabilitados (desaparecen) en Breached/Destroyed.
- Normal buildings: se quedan negros (DamageVisualFeedback), mesh visible como prop destruido.

### Noise balance
| Evento | noiseLevel | Radio (max 65m) |
|---|---|---|
| Breach (herramienta) | 15 | ~10m |
| Gunshot (pistola sin silenciador) | 80 | ~52m |
| Destroy action / Explosión | 90 | ~58m |

## Documentation index

- **`Documentation/IMPLEMENTATION_LOG.md`** — running log of what's done, per-sprint decisions, and rationale. Check this before proposing architectural changes.
- **`Documentation/GAME_DESIGN_DOCUMENT.md`** — full MVP spec (buildings, units, contracts, economy). Source of truth for gameplay intent.
- **`Documentation/SPRINT_*_GUIDE.md`** — per-sprint implementation notes (Sprint 1 through Sprint 5, plus 1.5).
- **`Documentation/CONTROLS.md`**, **`WORKFLOW.md`** — input reference and how Andrés wants the collaboration to run (he decides design/balance; implementation details are the AI's call).
- **`Documentation/COMMUNICATION_SYSTEM.md`**, **`INVESTIGATION_SYSTEM_CLEAN.md`**, **`FOV_GUARD_CODE_REF.md`** — deeper dives on specific subsystems.
- **`Assets/Scripts/README.md`** — folder structure + logic/visual separation rule.
