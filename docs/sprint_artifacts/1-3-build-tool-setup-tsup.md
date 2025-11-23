# Story 1.3: Build Tool Setup (tsup)

**Epic:** Foundation & Infrastructure  
**Story ID:** 1.3  
**Story Key:** 1-3-build-tool-setup-tsup  
**Status:** drafted  
**Created:** 2025-11-23

---

## User Story

As a developer,  
I want tsup configured for all packages,  
So that I can generate multi-format builds (ESM, CJS, UMD) with TypeScript declarations.

---

## Acceptance Criteria

### AC1: tsup Installation and Setup

**Given** TypeScript is configured  
**When** I set up tsup for building packages  
**Then**:

- tsup ^8.0.0 installed as root devDependency
- Each package can have tsup.config.ts
- Default config generates: ESM (.js), CJS (.cjs), IIFE (.global.js)
- TypeScript declarations (.d.ts) generated automatically (FR36)
- Source maps included (FR50)
- Minified production builds (FR49)

### AC2: Build Output Validation

**Given** tsup is configured  
**When** I verify build capabilities  
**Then**:

- ESM format output: dist/index.js
- CommonJS format output: dist/index.cjs
- UMD/IIFE format output: dist/index.global.js
- Type declarations: dist/index.d.ts
- Source maps: dist/\*.map files
- Clean builds remove old artifacts before building

### AC3: Package Build Configuration

**Given** tsup is set up  
**When** packages use tsup.config.ts  
**Then**:

- Config uses esbuild-powered builds (fast compilation)
- Zero-config TypeScript support
- Native multi-format output
- Bundle size target < 50kb gzipped (FR51)
- Development and production versions (FR54)

---

## Tasks & Subtasks

### Task 1: Install tsup

- [ ] Add tsup ^8.0.0 as root devDependency
- [ ] Verify tsup installation via `npx tsup --version`
- [ ] Review tsup documentation for configuration options

### Task 2: Create Default tsup Configuration Template

- [ ] Create reference tsup.config.ts with all required formats
- [ ] Configure ESM output (format: 'esm')
- [ ] Configure CJS output (format: 'cjs')
- [ ] Configure IIFE output (format: 'iife')
- [ ] Enable minification
- [ ] Enable source maps
- [ ] Configure clean builds

### Task 3: Document Package Build Pattern

- [ ] Document tsup.config.ts template for packages
- [ ] Explain entry point configuration
- [ ] Document output directory structure
- [ ] Add build script pattern to package.json

### Task 4: Verify Build System

- [ ] Create test package structure
- [ ] Run test build with tsup
- [ ] Verify all output formats generated
- [ ] Confirm type declarations created
- [ ] Validate source maps present
- [ ] Check minification working

---

## Prerequisites

**Story 1.1: Monorepo Initialization** - DONE ✅  
**Story 1.2: TypeScript Configuration** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 2.1: Core Package Structure
- Story 2.6: Core Package Exports & Build
- All package builds

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 2 (Build Tool Selection)**: tsup for all packages (esbuild-powered, zero-config, fast)
- **FR48**: Package bundles available in ESM, CommonJS, and UMD formats
- **FR49**: Minified production builds provided
- **FR50**: Source maps included for debugging
- **FR51**: Each game package has bundle size under 50kb (gzipped)

### tsup Configuration Template

**File: `tsup.config.ts` (reference for packages)**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point
  entry: ["src/index.ts"],

  // Output formats
  format: ["esm", "cjs", "iife"],

  // Output files
  outDir: "dist",

  // TypeScript
  dts: true, // Generate .d.ts files

  // Source maps
  sourcemap: true,

  // Minification
  minify: true,

  // Clean output directory before build
  clean: true,

  // Split chunks for better tree-shaking (ESM only)
  splitting: false,

  // Generate declaration maps
  // Requires TypeScript with declarationMap: true

  // Global name for IIFE build
  globalName: "MinigameCore", // Change per package

  // Target
  target: "es2020",

  // esbuild options
  esbuildOptions(options) {
    options.charset = "utf8";
  },
});
```

### Multi-Format Output Structure

After build, packages will have:

```
packages/core/
├── dist/
│   ├── index.js         # ESM format
│   ├── index.js.map     # ESM source map
│   ├── index.cjs        # CommonJS format
│   ├── index.cjs.map    # CJS source map
│   ├── index.global.js  # IIFE/UMD format
│   ├── index.global.js.map
│   ├── index.d.ts       # Type declarations
│   └── index.d.ts.map   # Declaration map
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Package.json Build Script Pattern

```json
{
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "clean": "rm -rf dist"
  }
}
```

### Why tsup?

**Benefits:**

- **esbuild-powered**: Extremely fast builds (10-100x faster than tsc)
- **Zero-config**: TypeScript support out of the box
- **Multi-format**: Native ESM, CJS, IIFE output
- **Type declarations**: Automatic .d.ts generation
- **Bundle analysis**: Built-in size reporting
- **Simple API**: Minimal configuration needed

**Alternatives considered:**

- **tsc**: Too slow, no bundling
- **rollup**: More complex configuration
- **webpack**: Overkill for library builds
- **esbuild directly**: No auto .d.ts generation

### Bundle Size Targets

Per FR51, each game package must be < 50kb gzipped:

- Core package: Target < 20kb gzipped
- Game packages: Target < 50kb gzipped each
- Total for core + 1 game: < 70kb gzipped

tsup reports bundle sizes automatically after build.

---

## Definition of Done

- [ ] tsup ^8.0.0 installed as root devDependency
- [ ] Reference tsup.config.ts created and documented
- [ ] Build output formats validated (ESM, CJS, IIFE)
- [ ] Type declarations (.d.ts) generation confirmed
- [ ] Source maps generation confirmed
- [ ] Minification verified working
- [ ] Clean builds confirmed (old artifacts removed)
- [ ] Documentation updated with build pattern
- [ ] Git commit with tsup setup

---

## Related FRs

- **FR48**: Package bundles available in ESM, CommonJS, and UMD formats
- **FR49**: Minified production builds provided for all packages
- **FR50**: Source maps included for debugging
- **FR51**: Each game package has bundle size under 50kb (gzipped)
- **FR54**: Build outputs include both development and production versions

---

## Dev Notes

### tsup vs tsc

**tsc (TypeScript compiler):**

- Only emits JavaScript + .d.ts
- No bundling
- Slow for large projects
- Used: Type checking only

**tsup:**

- Fast bundling via esbuild
- Multiple output formats
- Auto .d.ts generation
- Minification built-in
- Used: Production builds

### Development Workflow

During development:

```bash
# Watch mode for rapid iteration
pnpm build:watch

# One-off build
pnpm build

# Clean + build
pnpm clean && pnpm build
```

### Next Story Context

After this story, packages can be built. Story 2.1 (Core Package Structure) will create the first real package that uses this tsup setup.

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
