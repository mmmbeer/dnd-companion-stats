# Blink Dog Companion Manager - Development Plan

This document defines the authoritative development roadmap for the Blink Dog Companion Manager. The app uses plain HTML, CSS, and ES-module JavaScript with no framework or backend. The plan prioritizes rules correctness, state integrity, and extensibility over UI polish.

---

## 1. Core Goals and Constraints

### Primary Goals
- Manage one or more companions tied to a player character
- Enforce level-gated companion advancement
- Compute all derived values on demand (never stored)
- Persist state across reloads
- Support multiple companion types via structured data
- Guide advancement through a modal-based workflow
- Keep all logic deterministic and inspectable
- Conform UI styling to `docs/style-guide.md` (theme tokens, angular geometry, dense layout)

### Non-Goals
- No combat automation
- No dice rollers
- No server-side persistence
- No real-time multiplayer
- No player-character builder

---

## 2. Architectural Principles

1. Single source of truth
   - All mutable data lives in one state object
   - UI renders are pure functions of state
2. Derived, never stored
   - Ability modifiers, proficiency bonus, save DCs, skill bonuses, attack bonuses
3. Rules before UI
   - Illegal states are impossible to select
   - UI reflects rules, not the other way around
4. Data-driven companion definitions
   - Companion types are declarative data (no executable logic)

---

## 3. Folder and Module Layout (Final Target)

```
/app-root
  index.html
  app.js
  app.css

  scripts/
    core/
      state.js
      storage.js
      registry.js
      validation.js

    rules/
      abilities.js
      proficiency.js
      skills.js
      savingThrows.js
      advancement.js

    companions/
      loader.js
      schemas.js

    ui/
      render/
      modals/
      controls/
      navigation/

    init.js

  data/
    companions/
      blink_dog.json
      wolf.json

  styles/
    variables.css
    base.css
    layout.css
    components.css
    themes.css
    themes/
```

Note: The current codebase uses a smaller subset of this layout. The target structure remains the end goal.

---

## 4. Current Status (Checkpoint)

### Implemented
- Single-companion view with basic summary and advancement controls
- Basic rules helpers (ability modifiers, proficiency bonus)
- LocalStorage persistence (unversioned)
- Theme selection stored in state

### Partial / Needs Revision
- Advancement rules are present but not modal-driven
- Derived values are stored in state (proficiency bonus)
- UI renders use companion data directly without a formal registry
- No validation on load or before apply

### Missing
- Multi-companion state model and switching support
- Companion type loader/registry and schema validation
- Modal system and modal-based advancement flow
- Versioned state storage with explicit migrations
- Data-driven companion definitions in structured data files

---

## 5. Multi-Companion Support

### State Model

```js
state = {
  player: {
    level: number
  },
  companions: {
    [companionId]: {
      type: "blink_dog",
      name: "Flicker",
      advancementHistory: {},
      overrides: {}
    }
  },
  activeCompanionId: "uuid"
}
```

Key points:
- Each companion is independent
- Switching companions does not recompute others
- Advancement is tracked per companion

---

## 6. Companion Type Definitions (Structured Data)

### Design Requirements
- No executable code
- Fully declarative
- Versionable
- Validatable

---

## 7. Companion Loader and Registry

Responsibilities:
- Load companion data files at startup
- Validate against schema
- Register into a runtime registry

Registry API:
```js
getCompanionType(id)
listCompanionTypes()
validateCompanionInstance(instance)
```

---

## 8. Advancement Engine (Rules Layer)

Responsibilities:
- Determine eligibility
- Determine advancement type
- Prevent duplicates
- Enforce caps
- Write advancement history

API:
```js
canAdvance(companion, playerLevel)
getAdvancementType(companionType, playerLevel)
getAvailableChoices(companion, companionType, level)
applyAdvancement(companion, action)
```

No UI logic allowed here.

---

## 9. Modal-Driven Advancement Flow

Why modal:
- Prevents partial state changes
- Forces completion or cancel
- Guides users step-by-step

Odd-level flow:
1. Open modal
2. Explain advancement type
3. Choose category (feat / attack / skill)
4. Choose specific option
5. Confirm
6. Apply and persist

Even-level flow:
1. Open modal
2. Explain ASI
3. Select ability
4. Confirm
5. Apply and persist

Modal state:
- Temporary
- Discarded on cancel
- Only committed on confirm

---

## 10. UI Rendering Strategy

Rendering rules:
- No mutation inside render functions
- No derived calculations inside UI modules
- Modals read from rules layer
- Styling must use theme tokens from `styles/themes/` and follow `docs/style-guide.md` constraints

Required UI modules:
- Companion list sidebar
- Active companion summary
- Advancement button (conditional)
- Modal system (generic + advancement-specific)

---

## 11. Persistence Strategy

Storage:
- localStorage only
- Versioned state

Migration plan:
- Store state.version
- Apply explicit migration functions if version mismatch
- Never silently discard data

---

## 12. Validation and Error Handling

Validation layers:
1. Companion data schema validation
2. State validation on load
3. Rule validation before apply

Failure behavior:
- Log errors clearly
- Prevent invalid actions
- Never corrupt stored state

---

## 13. Testing Strategy (Manual + Automated)

Manual test harness:
- Companion switching
- Level jumping (e.g., 3 -> 10)
- Reload persistence
- Duplicate prevention
- Modal cancel safety

Automated (optional):
- Rule engine unit tests
- Schema validation tests

---

## 14. Phased Implementation Roadmap

### Phase 1 - Stabilize Core (Status: Partial)
- Finalize state schema (multi-companion model)
- Remove stored derived values from state
- Harden rules engine API and validation
- Add modal-driven advancement (required for any advancement UI)
- Add versioned persistence with explicit migrations

### Phase 2 - Structured Companion Types (Status: Not Started)
- Companion type loader
- Registry
- Schema validation

### Phase 3 - UI Expansion (Status: Not Started)
- Companion switcher
- Summary panels
- Warnings and confirmations

### Phase 4 - Polish (Status: Not Started)
- Undo safeguards
- Accessibility pass
- Visual clarity improvements

---

## 15. Exit Criteria (Definition of Done)

- Multiple companions supported
- Companion types load from structured data
- Advancement strictly enforced
- Modal flow prevents mistakes
- State survives reloads with versioning
- No illegal states possible via UI

---

## 16. Future Extensions (Out of Scope)

- Rest tracking
- Per-ability charge counters
- Player sheet mirroring
- PDF export
- Import/export state
