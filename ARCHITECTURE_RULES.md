# Architecture Rules For Agents (CLAUDE/CODEX)

This rule set applies to the `the-countdown` project: a React (TypeScript) web app backed by Convex.

## Scope

- Frontend: React 19 + TypeScript under `src/`.
- Backend: Convex functions under `convex/` (queries/mutations + schema). These rules
  govern `src/`; Convex is the external data layer (see section 4 — treated like a service).
- Styling: plain CSS (see section 5). Tailwind is intentionally not used here.
- Single-page app: there is no router (see section 8).

# ARCHITECTURE_RULES

## Mandatory Pre-Work

All coding agents (Codex, Claude, or any automated contributor) **must read this file before making any code change**.

---

## 1) Scope

- These architecture rules are mandatory for this project.
- Any new feature, refactor, or file move must follow this document.
- If an exception is needed, document it explicitly in the implementation notes/PR.

---

## 2) State Management and Data Flow

- Use `Context + Provider` patterns to avoid prop-drilling.
- Do not pass shared state through multiple component levels unless it is strictly local UI state.
- Each domain should expose a provider and a typed access hook when needed.
- Keep business logic out of presentational components.

---

## 3) Models and Domain Design

- Define explicit, typed models for domain entities.
- Keep model definitions centralized and reusable.
- Avoid ad-hoc object shapes spread across components.
- Validate incoming external data (API/local storage/imported JSON) before using it in views.

---

## 4) Manager Classes + Provider Access

- Use manager/service classes to encapsulate domain operations/state transitions.
- Managers/services should be instantiated and exposed through providers.
- Components must consume managers/state through provider APIs, not through direct global singletons.
- Keep side effects and orchestration inside managers/providers, not in UI leaf components.
- External integrations (Convex, `localStorage`) live in `shared/services/`. Example:
  `StorageService` wraps every `localStorage` read/write and is exposed via `storageService`.
- Convex data access (`useQuery`/`useMutation`) lives in the feature provider, never in leaf
  components. Effects that sync a Convex result into local state are the intended
  "subscribe to an external system" case.

---

## 5) Styling Rules (Plain CSS + Global Theme)

- Use **plain CSS** for component styling. This project does **not** use Tailwind.
- One CSS file per component, colocated as a sibling of the component (e.g.
  `features/countdown/components/TimeScale/TimeScale.css`). Each component imports its own stylesheet.
- Define theme tokens/variables in `src/styles/theme.css` (the `:root` design-token source: `--space-*`, `--size-*`, `--radius-*`, `--border-width-*`, `--color-*`, `--shadow-*`, `--font-size-*`, etc.). Keep shared globals and reusable utility classes (like `.eyebrow`, `.primary-action`, `.secondary-action`) in `src/styles/index.css`.
- Responsive value changes for tokenized properties are expressed as **token overrides inside media queries in `theme.css`**, so component CSS stays free of per-breakpoint dimension tweaks.
- See section 12 for the mandatory rule on using these tokens instead of literal values.
- Keep selectors scoped by the component's root class (e.g. `.countdown-card ...`) to avoid leakage between components.
- Global CSS should stay minimal and design-token oriented; avoid duplicating tokens in component files.

---

## 6) Folder Structure (Required) — Feature-Sliced

Organize the app around **features**. There is no top-level `lib/`, `components/`, `hooks/` or
`providers/`. Instead:

- `shared/` holds everything generic/cross-feature (used by more than one feature or app-wide).
- `features/` holds one folder per domain feature, each self-contained with its own
  `components/`, `hooks/`, `providers/`, etc.

```txt
src/
  app/                  # Composition root: app entry, router, provider wiring, layout shells
    routes.ts           # Centralized routes (as const)

  shared/               # Generic / cross-feature building blocks
    components/
      elements/          # Domain-agnostic UI primitives (Button, Icon, Spinner, Toast)
      patterns/          # Reusable compositions of elements (Dialog, Popup, ContextMenu)
    hooks/               # Reusable hooks used by multiple features
    providers/           # App-wide providers and context wiring
    models/              # Shared/generic types
    services/            # External integrations (e.g. Convex/localStorage service wrappers)
    managers/            # Cross-cutting domain managers
    utils/               # Shared helpers
    constants.ts         # Shared constants

  features/             # One folder per domain feature
    <feature>/
      components/        # Feature-specific components
      hooks/             # Feature-specific hooks
      providers/         # Feature-specific providers/context
      managers/          # Feature-specific domain managers
      models/            # Feature-specific types
      utils/             # Feature-specific helpers
      constants.ts       # Feature-specific constants
      <Feature>.tsx      # The feature screen/view (or a views/ subfolder)
      index.ts           # Public API of the feature

  lang/                 # i18n resources (translations, dictionaries)
  styles/               # Global styles (theme/tokens) + per-component CSS
```

Rules:

- Put code in a `features/<feature>/` folder when it belongs to one domain feature.
- Promote code to `shared/` only when it is reused across features or is genuinely generic.
- Keep `shared/components/elements/` limited to domain-agnostic UI primitives.
- Put reusable compositions of elements in `shared/components/patterns/`.
- Keep domain compositions (for example, the countdown card or setup dialog) inside their
  feature even when they consume shared patterns.
- Page templates and layout shells belong in `app/layout/`, not in `shared/components/`.
- A feature must not import the internals of another feature; cross-feature reuse goes through
  `shared/` (or a feature's public `index.ts`).
- The composition root in `app/` wires providers, routing and layouts; it may depend on features
  and `shared/`, but `shared/` must not depend on `features/`.

---

## 7) Unit-Level File Structure (Mandatory)

This applies to any non-trivial component or hook, whether it lives in `shared/` or inside a
`features/<feature>/` folder. When a unit needs supporting code, give it its own folder:

```txt
Something/
  Something.tsx|ts     # Only one component or one hook per file
  constants.ts         # Constants only
  utils.ts             # Reusable helper functions only
  types.ts             # Type aliases and interfaces only
  index.ts             # Public exports
```

Rules:

- One hook per file (`useSomething.ts`).
- One component per file (`Something.tsx`).
- Do not declare reusable helpers/constants/types inside component or hook files.
- Move helper functions to `utils.ts`.
- Move constants to `constants.ts`.
- Move interfaces/types to `types.ts`.
- Keep support files as siblings of the hook/component they support.
- If a hook/component grows, create its own folder and expose public API via `index.ts`.
- Preserve existing public imports by re-exporting from local `index.ts` files.

---

## 8) Routing Conventions (Mandatory)

**Not applicable to this project** — `the-countdown` is a single-page app with no router.
If a router is ever introduced, the rules below become mandatory.

- Centralize app routes in one file (for example: `src/app/routes.ts`) using constant objects (`as const`).
- Do not hardcode route strings in `navigate(...)`, `<Link to=...>`, `<Route path=...>`, menu config, or sitemap config.
- For dynamic routes and query-based routes, expose helper functions (for example: `getShipRoute(id)`).
- Centralize query parameter keys in route constants (for example: `RouteQueryParam`) and reuse them consistently.

---

## 9) i18n Rules

- Store translation resources in `src/lang/`. This project uses a lightweight typed
  dictionary (no external i18n lib): `lang/es.ts` holds the strings, `lang/index.ts`
  exports the active locale as `t`. Components import `{ t }` and read `t.section.key`.
- Dynamic strings (with interpolated values) are functions on the dictionary
  (e.g. `t.profile.with(partner)`, `t.readout.label(d, h, m, s)`), not template strings in JSX.
- No hardcoded user-facing strings in components. All display text lives in `lang/`.
- Keep translation keys consistent and domain-oriented.
- To add a locale later: add a sibling dictionary matching `Translations` and branch in `lang/index.ts`.

---

## 10) Implementation Discipline

- Prefer clear boundaries: UI layer, provider layer, domain logic layer.
- Prefer small, composable modules over monolithic files.
- Keep APIs typed and explicit.
- New features must follow these rules unless an exception is documented in the implementation notes/PR.

---

## 11) No Magic Literals — Use Named Constants (Mandatory)

Do not scatter raw literals (strings or numbers) through the code. A literal that carries
meaning, is compared against, or is reused must be a named constant.

### 11.1) Closed sets of string values → const-object "enum"

For a fixed set of related string values (modes, kinds, statuses), define a frozen const object
and derive its type from it. Do **not** use bare string unions or inline literals.

```ts
// features/countdown/constants.ts (pattern already used by SETUP_STEP)
export const SETUP_STEP = {
  IDLE: 'idle',
  NICKNAME: 'nickname',
  PARTNER: 'partner',
  SYNC: 'sync',
  DAYS: 'days',
  MESSAGES: 'messages',
} as const

export type SetupStep = (typeof SETUP_STEP)[keyof typeof SETUP_STEP]
```

Rules:

- Always `as const` so values are literal types, not widened `string`.
- Derive the type from the object (`(typeof X)[keyof typeof X]`); never hand-maintain a parallel union.
- Reference values as `SETUP_STEP.NICKNAME`, never the raw `"nickname"`.
- Place shared sets in `shared/constants.ts`; feature-only sets in `features/<feature>/constants.ts`.

### 11.2) Single values, formats and thresholds → named constants

- Reused single values (file extensions, format groups, numeric thresholds, timeouts, keys)
  go in `constants.ts` with a descriptive `UPPER_SNAKE_CASE` name (e.g. `MARKDOWN_FORMAT`,
  `IMAGE_FORMATS`, `ACCEPTED_PREVIEW_FORMATS`).
- Type collections as `readonly` (e.g. `readonly string[]`) to prevent mutation.
- Compose constants from constants instead of repeating literals.

### 11.3) User-facing text is not a constant — it is i18n

- Human-readable strings belong in `lang/` (see section 9), not in `constants.ts`.
- Constants are for machine values (enum tags, formats, keys); translations are for display text.

### 11.4) Allowed bare literals

- Trivial, non-semantic values with no reuse and obvious meaning (`0`, `1`, `-1`, `""`, `true`).
- Local-only loop/index math where a name adds no clarity.
- When in doubt, name it.

---

## 12) Design Tokens — No Literal Sizes in CSS (Mandatory)

All CSS must respect the theme in `src/styles/theme.css`. When you create or edit a CSS class,
do **not** hardcode dimensional/visual literals — use the existing `:root` tokens.

### 12.1) Use tokens, not literals

- Spacing (margin, padding, gap, top/left/right/bottom, inset): use `var(--space-*)`.
- Sizes (width, height, min/max, flex-basis): use `var(--size-*)`.
- Radius: `var(--radius-*)`. Border width: `var(--border-width-*)`. Blur: `var(--blur-*)`.
- Colors: `var(--color-*)`. Shadows: `var(--shadow-*)`. Icon/font sizing: the `--size-icon-*` / `--font-size-*` tokens.
- Never write raw `px`/`rem` for these properties when a token exists.

```css
/* ❌ literal values */
.panel {
  padding: 16px;
  gap: 10px;
  border-radius: 8px;
}

/* ✅ tokens from theme.css */
.panel {
  padding: var(--space-4);
  gap: var(--space-2-5);
  border-radius: var(--radius-md);
}
```

### 12.2) Need a value that has no token? Define one.

- Only when no existing token fits, add a **new token** to `theme.css` `:root`, then reference it.
- Reuse before adding: scan the existing `--space-*` / `--size-*` scale first; pick the closest
  rather than inventing a near-duplicate.
- Naming: follow the established convention — generic scale (`--space-6`), or purpose-named for
  one-off component dimensions (`--size-<thing>`, e.g. `--size-properties-width`).
- Add the token in `theme.css` only; never redeclare custom properties inside component CSS.

### 12.3) Allowed literals

- `0`, `100%`, `100vw`/`100vh`, `1fr`, `auto`, and ratio/percentage layout values.
- `transition`/`animation` timings and easings (no token scale for these yet).
- Genuinely one-off non-spatial values that carry no theme meaning.
- When in doubt, prefer a token.
