# Copilot / AI Agent Instructions — react-component-visu

## Project Overview
- **Purpose:** Visual React page/component builder with drag-and-drop canvas, generating TypeScript React components. See [src/lib/code-generator.ts](src/lib/code-generator.ts).
- **Stack:** Vite, React, TypeScript, Tailwind CSS. Code generation/schema changes require tests and migration notes.

## Essential Commands
- Install: `npm ci` or `npm install`
- Dev server: `npm run dev` (hot reload)
- Build: `npm run build` (typecheck + bundle)
- Preview: `npm run preview`
- Test: `npm run test` (Vitest, jsdom)
- Lint: `npm run lint`
- Deploy: `npm run predeploy` then `npm run deploy`
- Kill dev port: `npm run kill`

## Key Architecture & Patterns
- [src/App.tsx](src/App.tsx): App orchestrator and UI glue (add/move/delete/nest components). App uses local state and `localStorage` for a couple small UI preferences (`theme-mode`, `rightSidebarOpen`) — **canvas and export state is not automatically persisted** (note: previous versions referenced `useKV`; that is no longer present).
- [src/lib/code-generator.ts](src/lib/code-generator.ts): **Single source of code generation rules**. Rules to note:
  - UI primitives are imported as `import { Name } from '@/components/ui/name';` when `isUIComponent(type)` is true.
  - `setState` events generate `useState` declarations and `onChange` style handlers: e.g. `onChange={(e)=>setName(e.target.value)}`.
  - Props handled: strings -> quoted, booleans -> boolean attributes, numbers -> `{number}`, objects -> `JSON.stringify` in a JSX prop, and `styles` is mapped to `className`.
- [src/lib/component-library.ts](src/lib/component-library.ts): `COMPONENT_LIBRARY` and `CONTAINER_TYPES` list allowed component types, default props and nested children (only container types should receive children).
- [src/types/component.ts](src/types/component.ts): Canonical schema for components/events/config. If you change this, add a migration note and tests.
- [src/lib/layouts.ts](src/lib/layouts.ts): Pre-defined layouts (`LAYOUTS`) returned by `getLayoutComponents(id)`; also triggers for `spark:apply-layout` / `spark:preview-layout` are handled in `App.tsx`.

## Integration & Data Flow
- Window events: `spark:apply-layout`, `spark:preview-layout`, `spark:theme-change` (see [App.tsx](src/App.tsx)).
  - `spark:apply-layout` accepts either a layout `id` (string) or a full `CanvasComponent[]` payload — `App` will apply the layout and clear preview state.
  - `spark:preview-layout` receives a `CanvasComponent[]` for preview only.
  - `spark:theme-change` receives a `Record<string,string>` of CSS token values to apply to `document.documentElement`.
- Small UI preferences use `localStorage` (keys observed: `theme-mode`, `rightSidebarOpen`). Note: canvas components and export history live in memory and are not auto-persisted by the app.
- `ExportConfig` (see [src/types/component.ts](src/types/component.ts)) defines export destinations; there is no automatic remote push by default — exports are recorded in local state only.

## Project Conventions
- Module alias: `@` → `src` (see `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`). Use `@/` imports.
- UI primitive workflow (concrete):
  1. Add file in `src/components/ui/` (filename **lowercase**, component export **PascalCase**). Example: `src/components/ui/button.tsx` exports `Button`.
  2. Add an entry to `COMPONENT_LIBRARY` in `src/lib/component-library.ts` with `defaultProps`.
  3. If the component should be auto-imported into generated code, add the type name to `isUIComponent` inside `src/lib/code-generator.ts`.
  4. Add unit tests: generator-related tests live under `src/lib/__tests__/` and UI tests under `src/components/__tests__/`.
- Only types listed in `CONTAINER_TYPES` should receive children.
- Event mapping rules (as implemented in `generateEvents`):
  - `{ action: 'setState', target: 'name', type: 'onChange' }` → `onChange={(e) => setName(e.target.value)}`
  - `{ action: 'log', type: 'onClick' }` → `onClick={() => console.log('onClick')}`
  - Custom actions default to a noop handler; update `generateEvents` when adding new semantics.
- Props handling rules (see `generateProps`): strings become quoted props, booleans are rendered as bare boolean attributes (truthy only), numbers are rendered as `{number}`, other objects are stringified inside `{}`. `styles` prop becomes `className`.
- Adding new event types or changing event schema: update `src/lib/code-generator.ts` and add tests to `src/lib/__tests__/` (see `code-generator.test.ts` for examples).

## Testing & CI
- Tests: `npm run test` (see [src/components/__tests__/](src/components/__tests__) and [src/lib/__tests__/](src/lib/__tests__)).
- Watch mode: `npx vitest --watch --silent`
- CI: GitHub Actions runs tests, lint, and build on PRs.
- Schema changes: Add tests and migration note in PR if [src/types/component.ts](src/types/component.ts) changes. Ensure generator tests cover expected output (imports, state declarations, event handlers) when changing schema.
- Update [README.md](README.md) / [TEMPLATE.md](TEMPLATE.md) for public or workflow changes.

## Local Tooling & Warnings
- [vite.config.ts](vite.config.ts): `sparkPlugin()` is required; the old `createIconImportProxy()` was removed and the project standardizes on Fluent UI / Lucide icons (see comments in `vite.config.ts`).
- Scripts to note:
  - `npm run build` runs `tsc -b --noCheck && vite build` (type-check step is part of build pipeline).
  - `npm run kill` uses `fuser -k` (Linux); on Windows use a platform-appropriate port-killer (e.g., `taskkill`).
- If `packages/` exists, run tests for those packages too.
- Vitest runs in `jsdom` (see `package.json` `vitest` section).

## Examples
- Generator test (see [src/lib/__tests__/code-generator.test.ts](src/lib/__tests__/code-generator.test.ts)):
  - `expect(code).toContain("import { Button } from '@/components/ui/button';");`
  - `expect(code).toContain("const [name, setName] = useState('');");`
- Typical generated prop & event examples (from `code-generator.ts`):
  - Event: `{ type: 'onChange', action: 'setState', target: 'name' }` → `onChange={(e)=>setName(e.target.value)}`
  - Prop: `{ placeholder: 'name' }` → `placeholder="name"`
  - Styles: `styles: 'mt-2 text-muted'` → `className="mt-2 text-muted"`
- Layout integration example:
  - Dispatch `window.dispatchEvent(new CustomEvent('spark:apply-layout', { detail: 'landing' }))` or pass a full `CanvasComponent[]` payload to apply a layout programmatically.
- Canvas JSON → TSX: See `src/lib/code-generator.ts` and `src/lib/__tests__/` for input/output examples.

## Status Update
- All critical .tsx errors in the main components have been fixed as of December 24, 2025.
- Sidebars are collapsible, theme toggle works, and the canvas is WYSIWYG with inline editing.
- All blocking type, prop, and JSX errors are resolved.
- Style warnings and accessibility improvements are recommended for future work.

---
If any section is unclear or incomplete, please specify which area to expand or clarify.
