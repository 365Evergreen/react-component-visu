# Contributing (minimal)

Thanks for helping keep this repository a useful, stable template. This file contains the minimal guidance contributors should follow while making changes.

Checklist for PRs
- Build passes: `npm run build` (no type or runtime errors)
- Lint passes: `npm run lint`
- If you touch generator logic (`src/lib/code-generator.ts`), add unit tests and document migration notes in the PR description
- Update docs (`TEMPLATE.md`, `README.md`) when changing public behavior
- Keep changes focused and explain why they belong in the *template* rather than a downstream project

PR reviews & maintenance
- Prefer small, focused PRs. Template-level changes should include an explicit compatibility note for downstream consumers.
- If a change could require downstream migration, provide a short migration guide in the PR.

Contact
- If you're unsure whether a change belongs in the template, open an issue or tag a maintainer for guidance.