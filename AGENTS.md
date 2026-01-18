# AGENTS.md — Blink Dog Companion Manager

This document defines how a **Codex-style LLM coding agent** should operate when contributing to this project.  
It is authoritative. If instructions conflict, this file takes precedence.

---

## 1. Project Overview

This project is a **browser-based companion management app** for tabletop RPG companions (starting with a Blink Dog companion).

Core characteristics:
- Plain HTML, CSS, and JavaScript (ES modules)
- No frameworks
- No backend
- Deterministic rules enforcement
- Data-driven companion definitions
- Persistent state via localStorage

The **canonical development roadmap** is defined in:

```

docs/development-plan.md

```

The **initial companion specification** is defined in:

```

companions/blink-dog.md

````

---

## 2. Agent Role and Expectations

You are acting as a **professional software engineer**, not a chatbot.

Your responsibilities:
- Implement features exactly as described
- Preserve architectural boundaries
- Enforce rules strictly
- Avoid speculative or “helpful” deviations
- Produce drop-in, production-ready code

You must **not**:
- Introduce frameworks or build steps
- Collapse files “for convenience”
- Store derived values
- Invent rules not present in source documents
- Change existing data structures without instruction

---

## 3. Canonical Sources of Truth (Priority Order)

1. **docs/development-plan.md**  
   Overall architecture, phases, constraints

2. **companions/*.md**  
   Narrative and mechanical definitions of companions

3. **Existing source code**  
   Established patterns and APIs

If something is unclear, **follow existing patterns**, not assumptions.

---

## 4. Code Organization Rules

### File Size and Responsibility
- One file = one responsibility
- Prefer many small files over large files
- UI, rules, data, and persistence must remain separated

### No Cross-Layer Violations
- UI modules may not implement rules
- Rules modules may not touch the DOM
- State modules may not compute derived values

---

## 5. State Management Rules

### Single Source of Truth
All mutable data must live in a central state object.

Allowed:
```js
state.companions[id].advancementHistory[level]
````

Disallowed:

```js
state.blinkDog.saveDC = 13
state.skillBonuses = {}
```

### Derived Values

Derived values must be computed **on demand**, never stored:

* Ability modifiers
* Proficiency bonus
* Save DCs
* Skill bonuses
* Attack bonuses

---

## 6. Companion System Rules

### Companion Types

* Loaded from structured JSON (or generated from markdown)
* Must conform to a shared schema
* Must not embed executable logic

### Companion Instances

* Track name, type, advancement history, overrides
* Never mutate base definitions
* Advancement applies only to the instance

---

## 7. Advancement Rules (Critical)

Advancement logic must:

* Be level-gated
* Be deterministic
* Be irreversible per level
* Reject illegal actions

Advancement UI:

* Must be modal-driven
* Must allow cancel without side effects
* Must confirm before commit
* Must write to advancement history atomically

---

## 8. Modal System Requirements

All modals must:

* Be reusable
* Manage temporary state internally
* Commit changes only on explicit confirmation
* Be dismissible without mutation

No modal may directly mutate global state.

---

## 9. Persistence Rules

* Use localStorage only
* State must be versioned
* Never silently discard incompatible state
* Future migrations must be explicit functions

---

## 10. Styling and UI Constraints

* No inline styles
* Use CSS variables for all colors
* Themes loaded via `themes.css`
* UI clarity over visual flair

---

## 11. Testing Expectations

Before considering a task complete, mentally validate:

* Reload persistence
* Level skipping edge cases
* Duplicate prevention
* Cancel safety in modals
* Multiple companions switching cleanly

If a feature can be misused, it is incomplete.

---

## 12. Output Requirements

When asked to implement features:

* Provide **full, drop-in file replacements**
* Maintain folder structure
* Do not omit “unchanged” files if they are required for context
* Prefer correctness over brevity

If something is missing, ask **one precise clarifying question** only if absolutely necessary.

---

## 13. Non-Goals Reminder

You are not building:

* A combat engine
* A character builder
* A VTT
* A rules adjudicator beyond what is specified

Stay inside scope.

---

## 14. Final Guiding Principle

**The user values correctness, structure, and long-term maintainability over speed.**

Act accordingly.
