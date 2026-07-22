# Income Rescue Sprint — Evidence-to-Component Certification

Repository-ready executable implementation package for the first Resume Product slice.

## Includes
- Strict TypeScript domain models
- Zod runtime schemas
- Service skeletons and transition guards
- PostgreSQL migration files
- API request/response contracts
- Frontend workflow state definitions
- Unit, integration, contract, and frontend test scaffolding

## Governance boundaries
- No unsupported claims
- No silent canonical field changes
- Certified components are immutable
- Consequential actions require explicit authorization
- Original sources and prior versions remain recoverable

## Run after dependencies are installed
```bash
npm install
npm run typecheck
npm test
```
## Verified local execution

On 2026-07-20, dependencies were installed, TypeScript typecheck passed, and Vitest ran successfully. One implemented unit test passed; ten contract, frontend, and integration tests remain scaffolded/todo. See `EXECUTION_EVIDENCE.md`.

## Learning support

See `BUILD_GLOSSARY.md` for plain-language definitions of important build terms.


## Autonomous v3 working capability

Run `npm run verify` to typecheck, execute 17 tests, compile the package, and generate `minimal-ui-demo.html`.

The minimal vertical slice now executes evidence verification, evidence linking, deterministic Truth Gate review, QA review, certification, evidence trace rendering, and a user-friendly recovery route for unsupported wording.

Migration files are structurally validated. Execution against an actual PostgreSQL instance remains pending.
