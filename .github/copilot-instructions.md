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
- [src/App.tsx](src/App.tsx): App orchestrator, state persistence via `useKV` from `@github/spark/hooks`. Persistent keys: `canvas-components`, `export-history`, `page-layout`, `theme-tokens`.
- [src/lib/code-generator.ts](src/lib/code-generator.ts): **Single source of code generation rules**. UI primitives imported from `@/components/ui/<lowercase>`. `isUIComponent` controls import logic. Events like `{ action: 'setState', target: 'foo' }` generate `useState` and handlers.
- [src/lib/component-library.ts](src/lib/component-library.ts): `COMPONENT_LIBRARY` and `CONTAINER_TYPES` define available components, default props, and nesting rules.
- [src/types/component.ts](src/types/component.ts): Canonical schema for components/events/config. Update with tests and migration notes.
- [src/lib/layouts.ts](src/lib/layouts.ts): Predefined layouts, used via `spark:apply-layout` events.
- [src/components/ui/*](src/components/ui/): UI primitives. File: lowercase, export: PascalCase.

## Integration & Data Flow
- Window events: `spark:apply-layout`, `spark:preview-layout`, `spark:theme-change` (see [App.tsx](src/App.tsx)).
- State is persisted with `useKV` (keys are hardcoded).
- `ExportConfig` (see [src/types/component.ts](src/types/component.ts)) defines export destinations. No remote push by default.

## Project Conventions
- Module alias: `@` → `src` (see `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`). Use `@/` imports.
- UI primitive workflow:
  1. Add file in [src/components/ui/](src/components/ui/) (lowercase filename, PascalCase export)
  2. Add to `COMPONENT_LIBRARY` in [component-library.ts](src/lib/component-library.ts)
  3. Add to `isUIComponent` in [code-generator.ts](src/lib/code-generator.ts) if import needed
  4. Add unit test in [src/lib/__tests__/](src/lib/__tests__/)
- Only types in `CONTAINER_TYPES` can have children.
- `setState` events generate `useState` and `onChange` (input-like, uses `e.target.value`).
- Styling: `styles` prop maps to `className`.

## Testing & CI
- Tests: `npm run test` (see [src/components/__tests__/](src/components/__tests__) and [src/lib/__tests__/](src/lib/__tests__)).
- Watch mode: `npx vitest --watch --silent`
- CI: GitHub Actions runs tests, lint, and build on PRs.
- Schema changes: Add tests and migration note in PR if [src/types/component.ts](src/types/component.ts) changes.
- Update [README.md](README.md) / [TEMPLATE.md](TEMPLATE.md) for public or workflow changes.

## Local Tooling & Warnings
- [vite.config.ts](vite.config.ts): `createIconImportProxy()` and `sparkPlugin()` are required for icon imports/dev build.
- If `packages/` exists, run tests for those packages too.

## Examples
- Generator test (see [src/lib/__tests__/code-generator.test.ts](src/lib/__tests__/code-generator.test.ts)):
  - `expect(code).toContain("import { Button } from '@/components/ui/button';");`
  - `expect(code).toContain("const [name, setName] = useState('');");`
- Canvas JSON → TSX:
  - See [code-generator.ts](src/lib/code-generator.ts) and test files for input/output examples.

## Status Update
- All critical .tsx errors in the main components have been fixed as of December 24, 2025.
- Sidebars are collapsible, theme toggle works, and the canvas is WYSIWYG with inline editing.
- All blocking type, prop, and JSX errors are resolved.
- Style warnings and accessibility improvements are recommended for future work.

---
If any section is unclear or incomplete, please specify which area to expand or clarify.
