---
name: graphviz-visual-editor
description: A fast, brutalist modeling workspace for inspecting and editing agent-generated Graphviz diagrams.
colors:
  accent-cyan: "#4ed1f8"
  paper-white: "#fff"
  inky-black: "#000"
  error-red: "#ff3030"
  muted-gray: "#666"
  hover-gray: "#f0f0f0"
  graph-selection-blue: "#99ccff"
  graph-selection-stroke: "#0000dd"
typography:
  display:
    fontFamily: "\"Space Grotesk\", system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "\"Space Grotesk\", system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "\"Space Grotesk\", system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "\"Space Grotesk\", system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "\"JetBrains Mono\", ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "\"Space Grotesk\", system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  none: "0"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.inky-black}"
    rounded: "{rounded.none}"
    padding: "4px 16px"
  button-primary-hover:
    backgroundColor: "{colors.inky-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "4px 16px"
  icon-button:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.inky-black}"
    rounded: "{rounded.none}"
    width: "40px"
    height: "40px"
  input-field:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.inky-black}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  switch-checked:
    backgroundColor: "{colors.accent-cyan}"
    textColor: "{colors.inky-black}"
    rounded: "{rounded.none}"
    width: "32px"
    height: "16px"
---

# Design System: graphviz-visual-editor

## 1. Overview

**Creative North Star: "The Agent Drafting Table"**

graphviz-visual-editor is a fast, sleek, chic modeling workspace for humans supervising agent-generated Graphviz output. The user is watching diagrams arrive through MCP, checking the DOT source, and stepping in when a model needs correction. The interface must make that supervision feel immediate: graph, code, sync state, and errors are always close to the user's eye and hand.

The visual system keeps the existing brutalist discipline but aims for the cooler, sharper version of a modern Mermaid-style diagram editor. The canvas can be spacious and quiet; the chrome stays exacting, monochrome, square, and dense. Polish comes from alignment, typography, rhythm, and component consistency, not decoration.

The system explicitly rejects MUI / Material Design softness, Tailwind UI SaaS polish, rounded corners, soft gradients, over-animated dashboards, and anything that makes the editor feel like a marketing page instead of a working modeling surface.

**Key Characteristics:**
- Monochrome product chrome with one cyan state accent.
- Large graph canvas paired with immediate DOT access.
- Dense, predictable controls for long modeling sessions.
- Square geometry, strong borders, and hard offset depth.
- Light mode as the current baseline, with dark mode expected later.

## 2. Colors

The palette is a restrained product palette: black and white editor chrome, one electric cyan state accent, one red error color, and graph-specific selection colors reserved for the canvas.

### Primary
- **Electric Draft Cyan**: The only product accent. Use it for selection, focus highlight, active switches, active rows, and DOT-source markers. It should stay rare enough that it always means "look here."

### Neutral
- **Paper White**: The default app surface, graph frame, control background, dialog surface, and menu surface.
- **Inky Black**: The default text, icon, border, focus outline, and hard-shadow color.
- **Muted Gray**: Secondary text, disabled controls, helper text, and adornments.
- **Hover Gray**: Table-row hover only. Do not promote it into a general surface color unless the token file adds it.

### Error
- **Sharp Error Red**: Genuine parse errors, destructive actions, and error icons. Do not use it for warnings, decoration, or emphasis.

### Canvas Selection
- **Graph Selection Blue** and **Graph Selection Stroke**: Graph-canvas selection affordances owned by the rendered diagram surface, not by the surrounding UI chrome.

### Named Rules
**The One Voice Rule.** Cyan is the single product accent and should occupy less than 10% of any screen.

**The Canvas Exception Rule.** Graph content and graph selections may use their own colors; editor chrome may not borrow those colors for decoration.

## 3. Typography

**Display Font:** Space Grotesk, with system sans fallbacks.
**Body Font:** Space Grotesk, with system sans fallbacks.
**Label/Mono Font:** JetBrains Mono for code, keyboard data, and code-adjacent metadata.

**Character:** Space Grotesk gives the interface a crisp technical voice without feeling generic. JetBrains Mono marks DOT, metadata, and structured values as editable material rather than prose.

### Hierarchy
- **Display** (700, 32px, 1.1): Rare page-level titles only. Do not use it inside compact panels.
- **Headline** (700, 24px, 1.15): Dialog titles and major section headers.
- **Title** (600, 16px, 1.25): Toolbar title, compact section labels, and panel headings.
- **Body** (400, 14px, 1.4): Default UI text, menus, controls, and dialog copy. Keep prose to 65-75ch where prose exists.
- **Mono** (400, 14px, 1.4): DOT code, code-adjacent values, and technical text.
- **Label** (600, 12px, 0.05em, uppercase): Form labels, compact metadata, and scan-friendly control labels.

### Named Rules
**The Code-Is-Live Rule.** DOT source is not documentation; it is the editable model. Treat code surfaces as primary workspace, not secondary support.

## 4. Elevation

Depth is structural, never atmospheric. Surfaces are separated by borders first. Hard offset shadows appear only for hover, popups, dialogs, snackbars, and intentionally raised containers. There are no blurred shadows, glass layers, or gradient depth cues.

### Shadow Vocabulary
- **Hover Lift** (`2px 2px 0 0 #000`): Interactive lift for hoverable or raised controls, menus, snackbars, and cards.
- **Deep Dialog Lift** (`8px 8px 0 #000`): Modal dialog emphasis only.

### Named Rules
**The Flat-Until-Activated Rule.** A surface is flat at rest unless it is a popup or dialog. Elevation must indicate state, stack order, or temporary focus.

## 5. Components

### Buttons
- **Shape:** Square and tactile (0 radius) with a 2px black border.
- **Primary:** Paper White background, Inky Black text, uppercase Space Grotesk label, and 4px 16px padding.
- **Hover / Focus:** Invert to Inky Black background with Paper White text. Focus remains visible with a 2px outline offset.
- **Disabled:** Preserve shape, reduce opacity, and use a not-allowed cursor.

### Icon Buttons
- **Shape:** Fixed 40px square with centered icon and 2px black border.
- **Behavior:** Same inversion as text buttons. Use icons for toolbar tools wherever a familiar symbol exists.
- **Purpose:** Toolbar density. Do not replace clear tool icons with text unless the action needs a word to avoid ambiguity.

### Inputs / Fields
- **Style:** Paper White field, Inky Black text, thin black border, 4px 8px padding.
- **Focus:** 2px black outline with 2px offset. Never remove focus-visible affordance.
- **Adornments:** Muted Gray, compact, and aligned to the same 14px UI rhythm.

### Switches
- **Shape:** Compact 32px by 16px square-edged track with a 12px square thumb.
- **Checked State:** Electric Draft Cyan track, Inky Black thumb.
- **Motion:** 80ms linear thumb translation. It should feel immediate, not animated for its own sake.

### Navigation
- **App Bar:** White surface, black text, black bottom rule, 56px toolbar height, 64px app-frame rhythm.
- **Menus:** White popup, 2px black border, hard hover shadow, no padding beyond menu item rhythm.
- **Breadcrumbs / Titles:** Use compact title typography and preserve space for the canvas.

### Cards / Containers
- **Corner Style:** Square (0 radius).
- **Background:** Paper White only.
- **Border:** 1px black for standard containers, 2px black for focus or emphasis.
- **Shadow Strategy:** No decorative card stacks. Use cards only for repeated items, dialogs, and framed tools.

### Dialogs
- **Surface:** Paper White, 2px black border, deep hard offset shadow.
- **Backdrop:** Functional dimming only. Do not introduce glassmorphism.
- **Layout:** Centered, constrained, and dense. Dialogs must carry decisions or focused editing, not replace inline flows by default.

### Graph Canvas
- **Role:** The graph is the visual subject. It may contain color, transitions, shapes, and selection states that the editor chrome avoids.
- **Selection:** Use the graph selection colors only inside the canvas and source markers.
- **Behavior:** Pan, zoom, fit, source sync, and direct manipulation must stay visually discoverable without crowding the canvas.

## 6. Do's and Don'ts

### Do:
- **Do** make agent output inspectable through visible graph state, DOT source, sync state, and parse errors.
- **Do** preserve both direct manipulation and direct DOT editing.
- **Do** use Electric Draft Cyan only for active, selected, focused, or checked state.
- **Do** keep controls dense, aligned, and predictable for long modeling sessions.
- **Do** use Space Grotesk for UI and JetBrains Mono for code or code-adjacent metadata.
- **Do** keep every corner sharp at 0 radius.
- **Do** keep motion immediate and purposeful: 80ms linear for existing primitive states.

### Don't:
- **Don't** use MUI / Material Design patterns, including soft corners, floating paper stacks, and generic material spacing.
- **Don't** use Tailwind UI SaaS patterns, marketing-page composition, hero metrics, or repetitive card grids.
- **Don't** use rounded corners, soft gradients, gradient text, blurred shadows, or decorative glassmorphism.
- **Don't** add over-animated dashboards with bouncing curves or choreographed page-load sequences.
- **Don't** introduce extra accent colors into editor chrome. Graph content is the exception, not the rule.
- **Don't** hide code access, errors, or edit affordances behind modal-first flows.
