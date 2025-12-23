# Project Template — spark-template

Purpose
- This repository is a **stable starter template** for building React UI projects using the Spark design system and visual editor. It provides baseline components, pages, and themes for cloning or using as a GitHub Template repository.

Quick start
1. Use GitHub "Use this template" or clone the repository.
2. Run:
   - npm install
   - npm run dev
3. Modify `src/` for your project-specific UI and `theme.json` for brand tokens.

What to customize (safe)
- `src/components/ui/*` — add or change UI primitives
- `src/styles` and `theme.json` — brand colors, spacing, radii
- Top-level pages and layout under `src/`

What to keep stable (do NOT change unless you understand the upgrade implications)
- `src/lib/code-generator.ts` — code generation logic (changes require tests and migration notes)
- `src/types/component.ts` — canonical types for the visual model
- `vite.config.ts` plugin usage (`createIconImportProxy()` and `sparkPlugin()`)
- `packages/spark-tools` — local tooling and plugins

Export & generator notes
- This template is not focused on continuous exports from the visual editor. Treat code generation and exports as occasional operations; for changes to generator behavior, add unit tests and include a migration note in PRs.

Bootstrapping helper
- The repo includes `scripts/create-from-template.sh` to quickly clone and initialize a new project. See the script header for usage.

Sidebar features
- The left "Tools" sidebar includes three tabs: **Components** (collapsible tree view grouped by category), **Layouts** (page layout picker for full-page design), and **Theme** (live theme token editor that applies CSS variables and can export `theme.json`).

Support & contribution
- For template-related changes, open a PR and describe how downstream projects should migrate.

Enjoy — this repo is intended to make new projects start fast and predictable.