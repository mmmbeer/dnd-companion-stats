# Blink Dog Companion Manager — Full Development Plan

This document defines a **complete, structured development plan** for building a companion-management web app that is stable, extensible, and rules-safe. It assumes plain HTML, CSS, and modern ES-module JavaScript, no framework, no backend.

The plan deliberately prioritizes **data integrity, rule enforcement, and extensibility** over UI polish.

---

## 1. Core Goals and Constraints

### Primary Goals
- Manage one or more **companions** tied to a player character
- Enforce **level-gated companion advancement**
- Automatically calculate all derived values
- Persist state across reloads
- Support **multiple companion types** via structured JSON
- Guide advancement through a **modal-based workflow**
- Keep all logic deterministic and inspectable

### Non-Goals (Explicit)
- No combat automation
- No dice rollers
- No server-side persistence
- No real-time multiplayer
- No character builder for the player character itself (initially)

---

## 2. Architectural Principles

These rules are non-negotiable:

1. **Single Source of Truth**
   - All mutable data lives in a single state object
   - UI renders are pure functions of state

2. **Derived, Never Stored**
   - Ability modifiers
   - Proficiency bonus
   - Save DCs
   - Skill bonuses
   - Attack bonuses

3. **Rules Before UI**
   - Illegal states are impossible to select
   - UI reflects rules, not the other way around

4. **Data-Driven Companion Definitions**
   - Companion types are JSON, not hardcoded logic
   - Advancement options are declarative

---

## 3. Folder and Module Layout (Final Target)

```

/app-root
│
├── index.html
├── app.js
├── app.css
│
├── scripts/
│   ├── core/
│   │   ├── state.js
│   │   ├── storage.js
│   │   ├── registry.js
│   │   └── validation.js
│   │
│   ├── rules/
│   │   ├── abilities.js
│   │   ├── proficiency.js
│   │   ├── skills.js
│   │   ├── savingThrows.js
│   │   └── advancement.js
│   │
│   ├── companions/
│   │   ├── loader.js
│   │   └── schemas.js
│   │
│   ├── ui/
│   │   ├── render/
│   │   ├── modals/
│   │   ├── controls/
│   │   └── navigation/
│   │
│   └── init.js
│
├── data/
│   └── companions/
│       ├── blink_dog.json
│       ├── wolf.json
│       └── (future companions)
│
└── styles/
├── variables.css
├── base.css
├── layout.css
├── components.css
├── themes.css
└── themes/

````

---

## 4. Multi-Companion Support

### State Model Changes

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
````

Key points:

* Each companion is **independent**
* Switching companions does not recompute others
* Advancement is tracked per companion

---

## 5. Companion Type Definitions (JSON)

### Design Requirements

* No executable code
* Fully declarative
* Versionable
* Validatable

### Example: `blink_dog.json`

```json
{
  "id": "blink_dog",
  "name": "Blink Dog",
  "baseStats": {
    "abilities": {
      "str": 12,
      "dex": 16,
      "con": 12,
      "int": 8,
      "wis": 14,
      "cha": 11
    },
    "saves": ["dex", "wis"],
    "skills": {
      "perception": "proficient",
      "stealth": "proficient"
    }
  },

  "advancement": {
    "abilityScoreIncreases": {
      "levels": [5, 9, 13, 17],
      "maxScore": 20
    },
    "skills": {
      "levels": [4, 7, 8, 11, 12, 15, 16],
      "choices": ["specialSkills"]
    },
    "featsOrAttacks": {
      "levels": [6, 10, 14, 18],
      "choices": ["feats", "attacks"]
    }
  },

  "lists": {
    "feats": [
      { "name": "Phase Skirmisher", "description": ["..."] },
      { "name": "Pack Harrier", "description": ["..."] }
    ],
    "attacks": [
      { "name": "Phase Pounce", "description": ["..."] },
      { "name": "Blink Ram", "description": ["..."] }
    ],
    "specialSkills": [
      { "name": "Flickering Hover", "description": ["..."] },
      { "name": "Blinkcasting", "description": ["..."] }
    ]
  }
}
```

---

## 6. Companion Loader and Registry

### Responsibilities

* Load all companion JSON files at startup
* Validate against schema
* Register into a runtime registry

### Registry API

```js
getCompanionType(id)
listCompanionTypes()
validateCompanionInstance(instance)
```

This allows:

* Adding companions without touching code
* Safe future expansion

---

## 7. Advancement Engine (Rules Layer)

### Responsibilities

* Determine eligibility
* Determine advancement type
* Prevent duplicates
* Enforce caps
* Write advancement history
* Map explicit advancement levels:
  * Skills: 4, 7, 8, 11, 12, 15, 16
  * Feat or attack: 6, 10, 14, 18
  * Ability score increase: 5, 9, 13, 17

### API

```js
canAdvance(companion, companionType, playerLevel)
getAdvancementType(companionType, playerLevel)
getAdvancementContext(companion, companionType, playerLevel)
getAdvancementLevels(companionType)
applyAdvancement(companion, companionType, playerLevel, action)
```

No UI logic allowed here.

---

## 8. Modal-Driven Advancement Flow

### Why Modal

* Prevents partial state changes
* Forces completion or cancel
* Guides users step-by-step

### Modal Flow (Skill Advancement)

1. Open modal
2. Explain advancement type
3. Choose skill
4. Confirm
5. Apply + persist

### Modal Flow (Feat or Attack)

1. Open modal
2. Explain advancement type
3. Choose category (feat or attack)
4. Choose specific option
5. Confirm
6. Apply + persist

### Modal Flow (Ability Score Increase)

1. Open modal
2. Explain ASI
3. Select ability
4. Confirm
5. Apply + persist

### Modal State

* Temporary
* Discarded on cancel
* Only committed on confirm

---

## 9. UI Rendering Strategy

### Rendering Rules

* No mutation inside render functions
* No derived calculations inside UI
* Modals read from rules layer

### Required UI Modules

* Companion list sidebar
* Active companion summary
* Advancement button (conditional)
* Modal system (generic + advancement-specific)

---

## 10. Persistence Strategy

### Storage

* `localStorage`
* Versioned state

### Migration Plan

* Store `state.version`
* Apply migration functions if version mismatch
* Never silently discard data

---

## 11. Validation and Error Handling

### Validation Layers

1. JSON schema validation (companion types)
2. State validation on load
3. Rule validation before apply

### Failure Behavior

* Log errors clearly
* Prevent invalid actions
* Never corrupt stored state

---

## 12. Testing Strategy (Manual + Automated)

### Manual Test Harness

* Companion switching
* Level jumping (e.g., 3 → 10)
* Reload persistence
* Duplicate prevention
* Modal cancel safety

### Automated (Optional)

* Rule engine unit tests
* JSON schema validation tests

---

## 13. Phased Implementation Roadmap

### Phase 1 — Stabilize Core

* Finalize state schema
* Lock rule engine
* Add multi-companion support

### Phase 2 — JSON Companion Types

* Loader
* Registry
* Validation

### Phase 3 — Modal Advancement

* Generic modal system
* Advancement-specific flows

### Phase 4 — UI Expansion

* Companion switcher
* Summary panels
* Warnings and confirmations

### Phase 5 — Polish

* Undo safeguards
* Accessibility
* Visual clarity

---

## 14. Exit Criteria (Definition of Done)

* Multiple companions supported
* Companion types load from JSON
* Advancement strictly enforced
* Modal flow prevents mistakes
* State survives reloads
* No illegal states possible via UI

---

## 15. Future Extensions (Out of Scope, Planned)

* Rest tracking
* Per-ability charge counters
* Player sheet mirroring
* PDF export
* Import/export state
