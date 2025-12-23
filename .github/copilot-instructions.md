<<<<<<< HEAD
# Copilot Instructions (project-specific additions)

This project uses a Vite + React 19 + TypeScript setup for a visual builder. Important notes for Copilot agents working in this repo:

- Dev entrypoint for local work is in `src/index.html` (Vite root is `src/`). The Pages site uses the repo root `index.html` for the published build.
- Theme and UI state should persist in `localStorage` using keys: `rcv:theme`, `rcv:sidebar:left`, `rcv:sidebar:right`, `rcv:scale`, `rcv:editing`.
- Add new UI features as React components under `src/components` and add unit tests under `src/__tests__` using Vitest + Testing Library.
- When changing the build base for Pages, ensure `VITE_BASE` is set in the Pages workflow and `vite.config.ts` respects environmental overrides.
- Use the existing runtime shim in `index.html` only for quick previews; full features should be implemented in `src/` React code.

Examples:
- Theme toggler: update context `src/contexts/ThemeContext.tsx` and persist to `localStorage`.
- Sidebar: `Sidebar` component should expose `collapsed` state and persist with `rcv:sidebar:<side>`.

Testing:
- Use `vitest` and `@testing-library/react`. Add tests for theme persistence and sidebar collapse behavior.

When preparing a PR, include a brief README entry describing any developer scripts added (`npm run dev`, `npm run build`, `npm run test`).
=======
# Copilot / AI Agent Instructions — react-component-visu

## Quick orientation
- Purpose: Visual React page/component builder (drag/drop canvas) that generates TypeScript React components (see `src/lib/code-generator.ts`).
- Stack: Vite + React + TypeScript + Tailwind. Changes that affect code generation or the component schema need tests and a migration note.

---

## Quick commands (root)
- Install: `npm ci` (or `npm install`)
- Dev (hot-reload): `npm run dev` (Vite)
- Preview built site: `npm run preview`
- Build (typecheck + bundle): `npm run build` (runs `tsc -b --noCheck && vite build`)
- Kill dev port (5000): `npm run kill` (runs `fuser -k 5000/tcp`)
- Tests: `npm run test` (Vitest, `jsdom` env — see `vitest.config.ts`)
- Lint: `npm run lint`
- Deploy (gh-pages): `npm run predeploy` then `npm run deploy`

> Tip: Run `npm run build` after generator or type/schema changes to catch bundling/typing regressions early.

---

## Key files & concepts (short)
- `src/App.tsx` — application orchestrator and persistence. Uses `useKV` from `@github/spark/hooks`. Persistent keys to know: `canvas-components`, `export-history`, `page-layout`, `theme-tokens`.
- `src/lib/code-generator.ts` — **single source of generation rules**:
  - Imports UI primitives from `@/components/ui/<lowercase>` (e.g. `Button` -> `@/components/ui/button`).
  - `isUIComponent` controls which types are treated as imports.
  - `events` -> state mapping: `{ action: 'setState', target: 'foo' }` generates `const [foo, setFoo] = useState('')` and `onChange` handlers that use `e.target.value`.
  - Update generator unit tests in `src/lib/__tests__/code-generator.test.ts` when changing behavior.
- `src/lib/component-library.ts` — `COMPONENT_LIBRARY` entries and `CONTAINER_TYPES` control available components, default props, and allowed nesting.
- `src/types/component.ts` — canonical schema (`CanvasComponent`, `ComponentEvent`, `EventType`, `ExportConfig`) — **authoritative** for changes.
- `src/lib/layouts.ts` — predefined layouts accessed with `getLayoutComponents(id)` and exposed via `spark:apply-layout` events.
- `src/components/ui/*` — UI primitives (filename convention: lowercase file name, PascalCase export). Example: `src/components/ui/button.tsx` exports `Button`.

---

## Integration points & runtime behavior
- Window events used by the editor:
  - `spark:apply-layout` — payload: components array (applies immediately) OR layout id string (calls `getLayoutComponents`).
  - `spark:preview-layout` — payload: components array for preview.
  - `spark:theme-change` — payload: `{ [tokenName]: value }` — tokens are written to `document.documentElement` and persisted via `useKV`.
- `useKV` (from `@github/spark/hooks`) persists small app state. Keys are hard-coded in `App.tsx` — use those exact keys when integrating.
- `ExportConfig` (see `src/types/component.ts`) defines `destination: 'local' | 'git'`; currently `handleExport` writes to `export-history` in state — there is no automatic remote push in this template.

---

## Project conventions & patterns (actionable)
- Module alias: `@` → `src` (configured in `tsconfig.json`, `vite.config.ts`, and `vitest.config.ts`) — prefer `@/` imports for consistency.
- UI primitives:
  1. Add component file in `src/components/ui/<lowercase>.tsx` that exports a PascalCase component.
  2. Add an entry in `COMPONENT_LIBRARY` (`src/lib/component-library.ts`) with `defaultProps`.
  3. If you want the generator to import it, add the name to `isUIComponent` in `src/lib/code-generator.ts`.
  4. Add unit tests in `src/lib/__tests__` that assert import lines and generated state/handlers.
- Container behavior: only types in `CONTAINER_TYPES` may accept nested children. Use `CONTAINER_TYPES` when checking nesting rules.
- Events -> State: `setState` events create `useState` and `onChange` handling assumes input-like events (uses `e.target.value`). If you need other semantics, update `generateEvents` and add tests.
- Styling: some components set `styles` (string) and the generator maps that to `className` on the output.

---

## Tests, CI, and PR guidance
- Tests: `npm run test` (Vitest, JS DOM). See `src/components/__tests__` and `src/lib/__tests__` for examples.
- Run tests silently in watch mode: `npx vitest --watch --silent`
- CI: GitHub Actions runs tests, lint, and build on PRs.
- Lint & build: run `npm run lint` and `npm run build` in PRs that modify core behavior.
- Schema changes: If you modify `src/types/component.ts`, add unit tests and include a short **migration note** in the PR explaining downstream breakage/rationale.
- Update `README.md` / `TEMPLATE.md` when changing public behavior or developer workflow (see `CONTRIBUTING.md`).

---

## Local tooling & warnings
- `vite.config.ts` contains `createIconImportProxy()` and `sparkPlugin()` — **do not remove** them without validating icon imports and the dev build.
- The repo declares Yarn/NPM workspaces (`packages/*`). If a `packages` folder exists, run tests for those packages too.

---

## Quick examples (copy-paste)

- Generator test assertion (see `src/lib/__tests__/code-generator.test.ts`):
  - expect generated code to contain `import { Button } from '@/components/ui/button';` and `const [name, setName] = useState('');`

- Canvas JSON → generated TSX example (small)

  Input (Canvas JSON):

  ```json
  {
    "id": "root-1",
    "type": "div",
    "props": {},
    "children": [
      { "id": "btn-1", "type": "Button", "props": { "children": "Click" }, "children": [], "events": [{ "type": "onClick", "action": "log" }], "styles": "" },
      { "id": "input-1", "type": "Input", "props": { "placeholder": "name" }, "children": [], "events": [{ "type": "onChange", "action": "setState", "target": "name" }], "styles": "" }
    ],
    "events": [],
    "styles": ""
  }
  ```

  Generated TSX (what `generateComponentCode` produces):

  ```tsx
  import React, { useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  export function GeneratedComponent() {
    const [name, setName] = useState('');
    return (
      <div>
        <Button>Click</Button>
        <Input placeholder="name" onChange={(e) => setName(e.target.value)} />
      </div>
    );
  }

  export default GeneratedComponent;
  ```

- Generator test template (Vitest)

  ```ts
  import { describe, it, expect } from 'vitest';
  import { generateComponentCode } from '../code-generator';

  it('generates imports and state for setState events', () => {
    const code = generateComponentCode(sample as any, 'GeneratedTest');
    expect(code).toContain("import { Button } from '@/components/ui/button';");
    expect(code).toContain("const [name, setName] = useState('');");
  });
  ```

- Adding a UI primitive:
  - File: `src/components/ui/mycomp.tsx` export `function MyComp() {}`
  - Add to `COMPONENT_LIBRARY` and `isUIComponent` if generator should import it
  - Add unit test in `src/lib/__tests__`

---

If anything above is unclear or you'd like the file to include a different example or more test templates, tell me which area to expand and I’ll iterate. ✅
>>>>>>> origin/main
