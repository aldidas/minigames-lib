# Story 1.2: TypeScript Configuration

**Epic:** Foundation & Infrastructure  
**Story ID:** 1.2  
**Story Key:** 1-2-typescript-configuration  
**Status:** drafted  
**Created:** 2025-11-23

---

## User Story

As a developer,  
I want TypeScript properly configured across all packages,  
So that I get strict type checking and project references working correctly.

---

## Acceptance Criteria

### AC1: Root TypeScript Configuration

**Given** the monorepo structure exists  
**When** I set up the root TypeScript configuration  
**Then**:

- Root tsconfig.json exists with strict compiler options (FR39)
- compilerOptions include: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- target: `ES2020`, module: `ESNext`, lib: `["ES2020", "DOM"]`
- moduleResolution: `bundler` (as per Architecture decision 2)
- declaration: `true`, declarationMap: `true`, sourceMap: `true` (FR36)
- Configured for composite projects: `composite: true` support

### AC2: Compiler Options Validation

**Given** root tsconfig.json is created  
**When** I verify compiler options  
**Then**:

- All strict mode flags are enabled
- Type declarations (.d.ts) will be generated automatically
- Source maps enabled for debugging
- Module resolution set to `bundler` for modern tooling compatibility
- No `any` types allowed (noImplicitAny via strict mode)

### AC3: Package Extension Pattern

**Given** root TypeScript config exists  
**When** packages extend the root config  
**Then**:

- Packages can use `"extends": "../tsconfig.json"` pattern
- Packages can override specific options while inheriting base config
- Composite project setup enables incremental builds
- Project references work correctly between packages

---

## Tasks & Subtasks

### Task 1: Create Root tsconfig.json

- [ ] Create `tsconfig.json` at repository root
- [ ] Set `compilerOptions` with all required strict flags
- [ ] Configure target: ES2020, module: ESNext
- [ ] Set moduleResolution to `bundler`
- [ ] Enable declaration, declarationMap, sourceMap

### Task 2: Configure Strict Type Checking

- [ ] Enable `strict: true` (enables all strict checks)
- [ ] Add `noUnusedLocals: true`
- [ ] Add `noUnusedParameters: true`
- [ ] Add `noImplicitReturns: true`
- [ ] Verify no `any` escapes (noImplicitAny included in strict)

### Task 3: Setup Project References Support

- [ ] Add `composite: true` support for packages
- [ ] Configure `incremental: true` for faster builds
- [ ] Set up paths for package resolution (if needed)
- [ ] Document extension pattern for packages

### Task 4: Verify Configuration

- [ ] Create test TypeScript file to validate config
- [ ] Verify strict mode catches type errors
- [ ] Confirm declaration files can be generated
- [ ] Test that config is ready for package extension

---

## Prerequisites

**Story 1.1: Monorepo Initialization** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 1.3: Build Tool Setup (tsup)
- Story 2.1: Core Package Structure
- All TypeScript-based implementation

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 4 (TypeScript Configuration Strategy)**: Project References with Composite Projects
- **FR39**: Public APIs are 100% typed with no `any` usage
- **FR36**: All packages provide full TypeScript type definitions (.d.ts files)
- **FR40**: Developers get autocomplete and type checking

### Root tsconfig.json Configuration

**File: `tsconfig.json`**

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Type Checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Interop Constraints
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // Incremental Builds & Project References
    "incremental": true,
    "composite": true,

    // Completeness
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### Package Extension Pattern

Packages will extend root config in their own `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": []
}
```

### Strict Mode Benefits

The `strict: true` flag enables:

- `noImplicitAny` - No implicit any types
- `noImplicitThis` - No implicit this
- `strictNullChecks` - Null and undefined must be explicit
- `strictFunctionTypes` - Function types checked strictly
- `strictBindCallApply` - Strict bind/call/apply checking
- `strictPropertyInitialization` - Class properties must be initialized
- `alwaysStrict` - Emit "use strict"

This ensures FR39 (no `any` usage) is enforced at compile time.

### Module Resolution: Bundler

Using `moduleResolution: "bundler"` (modern approach):

- Works with modern bundlers (tsup, esbuild, vite)
- Supports package.json exports field
- Better ESM compatibility
- Recommended for libraries published to npm

---

## Definition of Done

- [ ] Root tsconfig.json created with all strict flags
- [ ] All compiler options match Architecture specification
- [ ] target: ES2020, module: ESNext, moduleResolution: bundler
- [ ] Declaration, source map generation enabled
- [ ] Composite project support configured
- [ ] Test TypeScript file validates strict mode works
- [ ] Documentation updated for package extension pattern
- [ ] Git commit with TypeScript configuration

---

## Related FRs

- **FR36**: All packages provide full TypeScript type definitions (.d.ts files)
- **FR39**: Public APIs are 100% typed with no `any` usage
- **FR40**: Developers get autocomplete and type checking when using the library
- **FR41**: Developers get IntelliSense hints in JavaScript projects via JSDoc

---

## Dev Notes

### Why Project References?

TypeScript Project References enable:

- **Incremental builds**: Only rebuild changed packages
- **Better IDE performance**: Faster type checking
- **Enforce boundaries**: Packages can only reference declared dependencies
- **Build order**: TypeScript understands dependency graph

### Why moduleResolution: bundler?

The `bundler` module resolution:

- Designed for modern bundlers (tsup uses esbuild)
- Better package.json exports support
- ESM-first approach
- Recommended for library development

### Next Story Context

After this story, Story 1.3 will add tsup build tooling. The TypeScript configuration created here will be used by tsup to generate multi-format builds (ESM, CJS, IIFE) with type declarations.

---

## Dev Agent Record

### Implementation Status

_To be filled by dev agent during implementation_

### Completion Notes

_To be filled by dev agent_

### Debug Log

_To be filled by dev agent if issues encountered_

### Files Changed

_To be filled by dev agent_

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-23 | 1.0     | Initial story creation | SM (Bob) |
