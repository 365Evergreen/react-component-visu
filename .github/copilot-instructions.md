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
