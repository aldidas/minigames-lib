# Story 2.1: Core Package Structure

**Epic:** Core Package - Game Framework  
**Story ID:** 2.1  
**Story Key:** 2-1-core-package-structure  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want the @minigame/core package structure initialized,  
So that I can begin implementing the game framework.

---

## Acceptance Criteria

### AC1: Package Directory Structure

**Given** the monorepo foundation exists  
**When** I create the core package structure  
**Then**:

- packages/core/ directory exists
- packages/core/src/ directory exists for source code
- packages/core/src/index.ts exists as main entry point
- packages/core/src/types/ directory exists for TypeScript types
- Directory structure follows monorepo conventions

### AC2: Package Configuration Files

**Given** the package directory exists  
**When** I configure the core package  
**Then**:

- packages/core/package.json with name: "@minigame/core", version: "1.0.0"
- Type: "module" in package.json
- Zero runtime dependencies (FR52)
- exports field configured for ESM/CJS/types
- files field includes only "dist"
- packages/core/tsconfig.json extends root config
- packages/core/tsup.config.ts configured for multi-format builds

### AC3: Build Configuration

**Given** package configuration exists  
**When** I verify build setup  
**Then**:

- tsup.config.ts generates ESM, CJS, IIFE outputs
- TypeScript declarations (.d.ts) generated
- Source maps enabled
- globalName: "MinigameCore" for IIFE build
- Build script: "tsup" in package.json
- Clean script configured

---

## Tasks & Subtasks

### Task 1: Create Package Directory Structure

- [ ] Create packages/core/ directory
- [ ] Create packages/core/src/ directory
- [ ] Create packages/core/src/types/ directory
- [ ] Create packages/core/src/index.ts (empty export for now)

### Task 2: Create package.json

- [ ] Set name: "@minigame/core"
- [ ] Set version: "1.0.0"
- [ ] Set type: "module"
- [ ] Set private: false (will be published)
- [ ] Configure exports field (import/require/types)
- [ ] Set files: ["dist"]
- [ ] Add build/dev/clean scripts
- [ ] Verify zero runtime dependencies

### Task 3: Create TypeScript Configuration

- [ ] Create packages/core/tsconfig.json
- [ ] Extend root tsconfig: "../../tsconfig.json"
- [ ] Set composite: true for project references
- [ ] Configure outDir: "./dist"
- [ ] Configure rootDir: "./src"
- [ ] Include: ["src/**/*"]

### Task 4: Create Build Configuration

- [ ] Create packages/core/tsup.config.ts
- [ ] Configure entry: ['src/index.ts']
- [ ] Configure formats: ['esm', 'cjs', 'iife']
- [ ] Set globalName: 'MinigameCore'
- [ ] Enable dts, sourcemap, minify, clean
- [ ] Set target: 'es2020'

### Task 5: Verify Package Setup

- [ ] Run `pnpm build` from core package
- [ ] Verify dist/ outputs generated
- [ ] Confirm zero dependencies in package.json
- [ ] Test workspace linking

---

## Prerequisites

**Epic 1: Foundation & Infrastructure** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 2.2: TypeScript Type Definitions
- All Epic 2 stories

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 6**: Package Dependency Strategy (zero runtime deps for core)
- **FR42**: Published as @minigame/core
- **FR52**: Zero runtime dependencies (only devDependencies allowed)

### Package.json

```json
{
  "name": "@minigame/core",
  "version": "1.0.0",
  "description": "Core framework for minigame library - BaseGame class, event system, and types",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "keywords": ["minigame", "core", "framework", "game", "typescript"],
  "author": "Aldi",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
```

### tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  outDir: "dist",
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: false,
  globalName: "MinigameCore",
  target: "es2020",
  esbuildOptions(options) {
    options.charset = "utf8";
  },
});
```

### Expected Directory Structure

```
packages/core/
├── src/
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Main entry point
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Definition of Done

- [ ] packages/core/ directory structure created
- [ ] package.json configured with correct name, version, exports
- [ ] tsconfig.json extends root config
- [ ] tsup.config.ts configured for multi-format builds
- [ ] src/index.ts created (can be empty export)
- [ ] Zero runtime dependencies confirmed
- [ ] Build successful: `pnpm build` works
- [ ] Git commit with core package structure

---

## Related FRs

- **FR42**: Core package published as @minigame/core
- **FR52**: Core package has zero runtime dependencies

---

## Dev Notes

### Why Zero Dependencies?

Core package has zero runtime dependencies to:

- **Minimize bundle size**: No external deps = smaller bundles
- **Security**: Fewer dependencies = less attack surface
- **Stability**: No version conflicts with user's dependencies
- **Performance**: Faster installs and smaller node_modules

### Package Exports

The exports field provides:

- **import**: ESM format for modern bundlers
- **require**: CommonJS for Node.js
- **types**: TypeScript declarations

This ensures compatibility across all environments.

### Next Story Context

After this story, Story 2.2 will define all TypeScript types and interfaces that the framework will use (events, game state, config).

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
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
