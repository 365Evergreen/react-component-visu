# Copilot / AI Agent Instructions — spark-template

Quick orientation
- Purpose: Visual React page/component builder (drag/drop canvas) that generates TypeScript React components (see `src/lib/code-generator.ts`).
- Stack: Vite + React + TypeScript + Tailwind; local workspace package `packages/spark-tools` provides plugins/hooks used at runtime.

Quick commands (root)
- Start dev server: `npm run dev` (Vite)
- Build: `npm run build` (runs `tsc -b --noCheck && vite build`)
- Preview build: `npm run preview`
- Free up port 5000: `npm run kill` (kills 5000/tcp)
- Lint: `npm run lint`
- Run package tests: `cd packages/spark-tools && npm test`

Where to look (key files)
- `src/App.tsx` — app orchestration, KV-backed canvas state keys: `canvas-components`, `export-history`.
- `src/lib/code-generator.ts` — how visual model -> TSX code is generated (imports, state hooks, events).
- `src/lib/component-library.ts` — canonical list of library items and `CONTAINER_TYPES` (used for nesting rules and UI badges).
- `src/types/component.ts` — canonical types for components/events/exports (source of truth for shape of the canvas model).
- `src/components/ui/*` — UI primitives the generator imports from (file names are **lowercased**; exported component names are PascalCase, e.g. `button.tsx` -> `Button`).
- `src/components/*` — canvas, tree, property editor, toolbar components implementing the editor UX.
- `vite.config.ts` — important plugins: `createIconImportProxy()` (DO NOT REMOVE), `sparkPlugin()`; also uses `PROJECT_ROOT` to resolve `@` alias.
- `tailwind.config.js` + `theme.json` — theme uses CSS variables and can be customized.

Project-specific conventions to preserve
- Module alias: `@/*` -> `src/*` (defined in `tsconfig.json` and `vite.config.ts`). Keep imports using `@/…`.
- UI component file naming: files under `src/components/ui` are lowercased and imported by the code generator with `comp.toLowerCase()` — if you add a UI component, ensure filename matches this convention and add the component to `isUIComponent` in `code-generator.ts` when the generator should import it.
- Event/state pattern: events with `action: 'setState'` map to `useState` declarations in generated code. Event target names are capitalized to derive setter names (`myState` -> `setMyState`). Follow the existing event shape in `src/types/component.ts`.
- Container types (nesting): `CONTAINER_TYPES` list in `component-library.ts` determines which library items can accept children; maintain consistency there when adding containers.
- Persistent state: the app uses `useKV` from `@github/spark/hooks` for simple persistence; keys are strings and used directly (e.g., `canvas-components`).

Sidebar features
- The left sidebar (Tools) now includes three tabs: **Components** (collapsible tree view grouped by category), **Layouts** (page layout picker for full-page design), and **Theme** (live theme token editor that applies CSS variables and can export `theme.json`).
- Layout changes emit `spark:select-layout` events; theme changes emit `spark:theme-change` events so other parts of the app (like `App.tsx`) can react.
- If you modify the sidebar or add new layout presets, update `src/components/PageLayoutPicker.tsx` and ensure any new theme token keys are applied consistently in `ThemeDesigner.tsx`.

Integration & plugin notes
- `packages/spark-tools` contains the local `@github/spark` package (plugins, hooks). If you modify plugin behavior, add/adjust tests in that package and update exports in its `package.json`.
- Icon imports are proxied via `createIconImportProxy()` — do not remove or replace unless you understand the Phosphor icon proxy behavior.

How to make common changes (examples)
- Add a new UI primitive:
  1. Add `src/components/ui/<lowercase>.tsx` exporting a PascalCase component.
  2. Add the type to `src/types/component.ts` if needed.
  3. Add an entry to `src/lib/component-library.ts` (type, defaultProps, category, icon).
  4. If the code generator must import it, add the name to `isUIComponent` in `src/lib/code-generator.ts`.
  5. Run `npm run lint` and `npm run build`.

Common pitfalls and troubleshooting
- Aliases failing in other environments: ensure `PROJECT_ROOT` is set or run Vite from project root (vite resolves `@` using `PROJECT_ROOT`).
- Port conflicts when previewing: use `npm run kill` to free port 5000.
- When updating generator logic, unit-test the generator with representative `CanvasComponent` inputs and inspect the output for import and state correctness.

Safety for automated edits
- Avoid changing `createIconImportProxy()` usage or `sparkPlugin()` in `vite.config.ts` without testing icon imports and the dev build.
- Keep `src/types/component.ts` authoritative; refactor there first and update consumers (`code-generator.ts`, UI files, component library).

Template repository note ✅
- This repository is maintained as a **stable starter template** (baseline components, pages, and themes) intended to be cloned or used as a GitHub Template for new projects.
- Prefer stability over continuous changes: avoid adding features that encourage frequent live exports or unstable breaking changes. Large or breaking changes should include a migration note in the PR and tests where appropriate.
- For generator/export changes: add unit tests for `src/lib/code-generator.ts`, document compatibility impact in your PR, and update `TEMPLATE.md` and `CONTRIBUTING.md` as needed.

If anything above is unclear or you need more examples (e.g., a small test case for `generateComponentCode`), tell me which part you'd like expanded and I’ll add a short example or tests. ✅
