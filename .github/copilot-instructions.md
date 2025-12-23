# Copilot / AI Agent Instructions — spark-template

Quick orientation
- Purpose: Visual React page/component builder (drag/drop canvas) that generates TypeScript React components (see `src/lib/code-generator.ts`).
- Stack: Vite + React + TypeScript + Tailwind. This template is stable — changes to the generator or core types need tests and migration notes.

Quick commands (root)
- Install: `npm ci` (or `npm install`) to restore deps.
- Dev: `npm run dev` (vite)
- Build: `npm run build` (runs `tsc -b --noCheck && vite build`)
- Preview built site: `npm run preview`
- Kill dev port (5000): `npm run kill` (runs `fuser -k 5000/tcp`)
- Tests: `npm run test` (vitest, jsdom environment; see `vitest.config.ts`)
- Lint: `npm run lint`
- Deploy (gh-pages): `npm run predeploy` then `npm run deploy` (uses `gh-pages -d dist`)

Where to look (key files)
- `src/App.tsx` — orchestration and persistence. Key `useKV` keys: `canvas-components`, `export-history`, `page-layout`, `theme-tokens` (used for preview/apply operations and persisted app state).
- `src/lib/code-generator.ts` — rules for generating TSX: 1) imports: UI components are imported from `@/components/ui/<lowercase>`, 2) `isUIComponent` lists components considered UI primitives, 3) events -> state mapping (e.g., `setState` generates `useState` + handler).
- `src/lib/component-library.ts` — `COMPONENT_LIBRARY` & `CONTAINER_TYPES` control available components, default props, and nesting rules.
- `src/types/component.ts` — canonical model: `CanvasComponent`, `ComponentEvent`, `EventType`, `ComponentLibraryItem` (source of truth; change carefully).
- `src/components/ui/*` — UI primitives: filenames are lowercase (e.g., `button.tsx`) and export PascalCase (e.g., `Button`) used by generator.
- `src/components/*` — editor UI (CanvasArea, Sidebar, PropertyPanel, etc.).
- `vite.config.ts` — DO NOT REMOVE `createIconImportProxy()` or `sparkPlugin()`; also uses `PROJECT_ROOT` env var when resolving `@`.
- `tailwind.config.js` + `theme.json` — theme tokens are applied as CSS variables.

Event and integration notes
- Window events used by the editor:
  - `spark:apply-layout` — payload is either an array of `CanvasComponent` (applies layout) or a layout id string (uses `getLayoutComponents`).
  - `spark:preview-layout` — payload is an array of `CanvasComponent` to preview.
  - `spark:theme-change` — payload is `{ [tokenName]: value }`; handler writes tokens to `document.documentElement` and persists via `useKV`.
- Persistence: `useKV` from `@github/spark/hooks` stores simple state (strings/objects). Key names are literals in `App.tsx`.

Project-specific conventions
- Module alias: `@` -> `src` (configured in `tsconfig.json`, `vite.config.ts`, and `vitest.config.ts`) — always prefer `@/` imports.
- UI files: save UI primitives under `src/components/ui/<lowercase>.tsx` and add to generator `isUIComponent` list when needed.
- State & events: `ComponentEvent { action: 'setState', target: 'name' }` -> `const [name, setName] = useState('')` and `onChange={(e) => setName(e.target.value)}` in generated code.
- Container types: only values in `CONTAINER_TYPES` should be treated as containers for nesting.

Testing & changing generator code
- Tests run with `npm run test` (vitest, jsdom). Example generator test located at `src/lib/__tests__/code-generator.test.ts` — it asserts import lines and generated `useState` declarations.
- When changing code generation or `src/types/component.ts`:
  - Add unit tests in `src/lib/__tests__` and run `npm run test`.
  - Run `npm run lint` and `npm run build` to catch TypeScript and bundling issues.
  - Include a migration note in PRs for downstream projects.

Local tooling note
- The template mentions `packages/spark-tools` (local `@github/spark` plugin/hooks) in some forks; this repo may or may not include it. If present, run its tests (`cd packages/spark-tools && npm test`) and update exports there when changing plugin behavior.

Safety & integration warnings
- **DO NOT** remove `createIconImportProxy()` or `sparkPlugin()` from `vite.config.ts` without validating icon imports and the dev build.
- Keep `src/types/component.ts` authoritative. Large schema changes should include tests and a PR migration note.

Short examples
- Add UI primitive:
  1. `src/components/ui/<lowercase>.tsx` export `function MyComp(){}`
  2. Add `MyComp` type/entry in `src/lib/component-library.ts`
  3. If generator must import it, add `MyComp` to `isUIComponent` in `src/lib/code-generator.ts`
  4. Add unit tests in `src/lib/__tests__` and run `npm run test`

If anything is unclear or you want additional examples (small generated code samples or test templates), tell me which part to expand and I’ll add a concise example or test. ✅
