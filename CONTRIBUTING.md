## Contributing

### Local development

- Node.js version: see [.nvmrc](.nvmrc)
- Install: `npm ci`
- Dev: `npm run dev`

### Quality checks

- Lint: `npm run lint`
- Stylelint: `npm run lint:style`
- Format check: `npm run format:check`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`

### Testing guidelines

- Unit tests (Vitest): utility functions in `src/utils/`, complex composables in `src/composables/`, and non-trivial stores in `src/stores/`
- E2E tests (Playwright): critical user flows (login/logout, upload, create user) and new route pages smoke tests
- Naming: unit tests live next to source as `*.test.ts`; e2e tests live in `e2e/` as `*.spec.ts`
- Data: tests should rely on MSW mocks in `src/mocks/` rather than a real backend

### Pull requests

- Keep changes focused and include tests when applicable
- Ensure `npm run test` passes before opening a PR
