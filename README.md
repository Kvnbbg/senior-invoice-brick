# Senior Brick — Isolated Invoice Calculation Domain

## Context

This repository implements a **single isolated functional brick** demonstrating senior-level architectural rigor:

- Strict TypeScript typing with branded types and runtime validation (Zod)
- Sealed domain invariants (Money never negative, currencies never mixed)
- Pure, side-effect-free calculation service
- Minimal but complete unit test suite (Jest + ts-jest)
- Presentation component ready for React + Tailwind

The goal is to replace “vibe-coded” prototypes with code that is safe to put in production, reviewable, and maintainable.

## Architecture

```
src/
├── domain/
│   ├── money.ts          # Value object + operations (branded, immutable)
│   └── invoice.ts        # Pure calculation service
└── components/
    └── InvoiceSummary.tsx # Typed React component (Tailwind-ready)
tests/
└── domain.test.ts        # 8 tests covering happy path + invariants
```

### Key technical choices

| Decision | Rationale |
|----------|-----------|
| Branded `Money` type | Prevents accidental use of raw `number` or mixing currencies at compile time |
| Zod schemas | Runtime validation mirrors the type system; fails fast at the boundary |
| Minor units (cents) | Avoids floating-point money bugs |
| Pure functions only | Deterministic, easily testable, no hidden state |
| Explicit error throwing on invariant violation | Fail-fast; callers must handle domain errors |

## Running the tests

```bash
npm install
npm test
```

Expected output: **8 passed, 8 total** (100 % success).

## Proof of execution

```
PASS tests/domain.test.ts
  Money value object
    ✓ creates valid money
    ✓ rejects negative amounts
    ✓ adds same currency
    ✓ throws on currency mismatch
    ✓ formats correctly
  Invoice calculation service
    ✓ calculates totals correctly
    ✓ rejects invalid tax rate
    ✓ rejects mismatched line currency

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

## Pull Request checklist (Senior)

- [x] Strict TypeScript (`strict: true`, `noUncheckedIndexedAccess`, etc.)
- [x] Domain invariants enforced at construction and operation time
- [x] 100 % test success before any merge
- [x] No side effects in the calculation brick
- [x] Component is purely presentational
- [x] Documentation of design decisions

## Next steps (out of scope for this brick)

- Persistence layer (PostgreSQL + FastAPI or Node)
- Integration tests
- OpenAPI / tRPC contract
- Full design-system Tailwind tokens
