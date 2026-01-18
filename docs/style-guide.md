# UI / UX Style Guideline  
**Project:** Companion Manager (Blink Dog and beyond)

This document defines the **visual language** of the app.  
It is not decorative guidance. It is a constraint system.

The goal is a UI that feels like a **magical instrument**, not a website.

---

## 1. Core Aesthetic Pillars

### Overall Feel
- Sleek
- Modern
- Arcane
- Precise
- Slightly austere

This is **high fantasy through modern restraint**, not parchment, not skeuomorphic, not cozy.

---

## 2. Geometry & Layout Rules

### Shapes
- **Angular only**
- No rounded corners
- No pills
- No bubbles

**Allowed**
- Sharp rectangles
- Diagonal cuts
- Chamfered corners (very small, optional)

**Forbidden**
- Border-radius greater than `2px`
- Fully rounded elements
- Circles except for icons or indicators

### Lines
- Thin lines only
- Borders: `1px` standard
- Dividers: `1px` or hairline
- Emphasis via contrast, not thickness

---

## 3. Spacing & Density

### Padding
- Minimal
- Dense but readable

**Guidelines**
- Section padding: `8–12px`
- Button padding: `4–8px`
- Modal padding: `12–16px`
- Vertical rhythm is tight

Whitespace should feel **intentional**, not generous.

---

## 4. Typography

### Font Personality
- Fantasy-inspired
- Sharp serifs or angular glyphs
- Must remain readable at small sizes

### Font Roles

#### Primary UI Font
Used for:
- Labels
- Buttons
- Inputs
- Body text

Characteristics:
- Narrow or semi-condensed
- Clean letterforms
- Slightly stylized

Examples (pick one family):
- Cinzel
- Trajan-inspired serif
- Cormorant (clean weights only)
- Custom fantasy serif with restrained ornamentation

#### Display / Heading Font
Used for:
- Section headers
- Companion names
- Modal titles

Characteristics:
- Strong vertical strokes
- Slightly dramatic
- Distinct from body font

Avoid exaggerated calligraphy.

### Text Treatment
- Uppercase sparingly
- Letter-spacing slightly increased for headers
- No playful typography

---

## 5. Color Philosophy

### Color Role Hierarchy
1. **Background** – deep, atmospheric
2. **Surface** – slightly lifted planes
3. **Linework** – crisp separators
4. **Accent** – magical energy
5. **Text** – high contrast, never gray-on-gray

Colors should feel **enchanted**, not neon, not pastel.

---

## 6. Base Color Tokens

All themes must define at least:

```css
--bg
--surface
--border
--text-primary
--text-muted
--accent
--accent-soft
--danger
--success
````

No hardcoded colors outside theme files.

---

## 7. Color Schemes (Themes)

### Theme 1 — Arcane Midnight (Default)

**Mood:** Wizard tower, ley lines, night magic

* Background: deep indigo / near-black
* Surface: cold blue-black
* Borders: muted steel-blue
* Accent: arcane violet
* Soft accent: faded lavender
* Text: pale silver

**Use case**

* Default theme
* Long sessions
* Low eye strain

---

### Theme 2 — Feywild Verdancy

**Mood:** Otherworldly forest, trickster magic

* Background: dark emerald
* Surface: near-black green
* Borders: mossy bronze
* Accent: luminous mint-green
* Soft accent: pale leaf
* Text: warm ivory

**Use case**

* Blink dog / fey companions
* Nature-aligned builds

---

### Theme 3 — Astral Ember

**Mood:** Planar fire, star-forged magic

* Background: deep charcoal
* Surface: obsidian
* Borders: ember-red steel
* Accent: molten gold
* Soft accent: amber glow
* Text: parchment-white

**Use case**

* Offensive companions
* High-impact advancement moments

---

### Theme 4 — Void Sapphire

**Mood:** Cosmic, extradimensional precision

* Background: near-black navy
* Surface: cold slate
* Borders: sharp sapphire
* Accent: electric cyan
* Soft accent: icy blue
* Text: cool white

**Use case**

* Teleportation-heavy companions
* Phase and planar mechanics

---

### Theme 5 — Relic Stone (Light Theme)

**Mood:** Ancient runes, carved stone

* Background: pale stone
* Surface: light slate
* Borders: dark iron
* Accent: royal purple
* Soft accent: dusty violet
* Text: near-black

**Use case**

* Daylight play
* Print-adjacent feel without parchment clichés

---

## 8. Interactive Elements

### Buttons

* Flat
* Bordered
* No gradients
* Hover = color shift, not size change
* Active = inset border or darker surface

### Inputs

* Sharp edges
* Clear focus outline
* No glow
* No soft shadows

### Modals

* Full focus
* Hard edges
* Clear title bar
* Divider lines, not cards

---

## 9. Icons & Visual Language

* Line icons only
* No filled icons
* Thin stroke
* Angular geometry

Icons should resemble:

* Sigils
* Runes
* Arcane markings

---

## 10. Animation & Motion

* Minimal
* Fast
* Purposeful

**Allowed**

* Fade-in
* Slide-in
* Subtle opacity shifts

**Forbidden**

* Bounce
* Elastic easing
* Overshoot
* Whimsy

---

## 11. Anti-Patterns (Do Not Use)

* Rounded cards
* Drop shadows as decoration
* Excessive padding
* Gradients as background
* Cartoon fantasy visuals
* Parchment textures
* Wood, leather, or “tabletop” tropes

---

## 12. Design Litmus Test

If an element feels:

* Cute → remove it
* Cozy → sharpen it
* Decorative → justify it or delete it
* Soft → make it precise

The UI should feel like **a magical control panel**, not a game UI.

---

## 13. Implementation Notes

* All themes live in `styles/themes/`
* `themes.css` is the only importer
* Switching themes must not change layout
* Colors must be swappable without refactoring components
