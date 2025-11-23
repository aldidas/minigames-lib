# Story 3.2: Multi-Format Build Configuration

**Epic:** Build & Distribution Pipeline  
**Story ID:** 3.2  
**Story Key:** 3-2-multi-format-build-configuration  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want packages built in multiple formats,  
So that I can use them in any JavaScript environment (ESM, CJS, or browser).

---

## Acceptance Criteria

### AC1: Build Format Verification

**Given** package metadata is configured  
**When** I verify build configurations  
**Then**:

- Each package builds to ESM format (index.js) for modern bundlers
- Each package builds to CommonJS format (index.cjs) for Node.js
- Each package builds to UMD/IIFE format (index.global.js) for browsers
- All formats include proper entry points in package.json

### AC2: Build Optimization

**Given** build formats configured  
**When** I verify build optimization  
**Then**:

- Minified production builds (FR49)
- Development and production versions (FR54)
- Source maps included for all formats (FR50)
- tsup config specifies: format ['esm', 'cjs', 'iife'], minify: true, sourcemap: true

### AC3: Bundle Size Validation

**Given** builds complete  
**When** I verify bundle sizes  
**Then**:

- Core package < 20kb gzipped
- Each game package < 50kb gzipped (FR51)
- Bundle size documented
- Size targets met for all packages

---

## Tasks & Subtasks

### Task 1: Verify tsup Configurations

- [ ] Review @minigame/core tsup.config.ts
- [ ] Confirm formats: ['esm', 'cjs', 'iife']
- [ ] Confirm minify: true
- [ ] Confirm sourcemap: true
- [ ] Verify globalName set for IIFE

### Task 2: Validate Build Outputs

- [ ] Run pnpm build on core package
- [ ] Verify dist/index.js (ESM) exists
- [ ] Verify dist/index.cjs (CJS) exists
- [ ] Verify dist/index.global.js (IIFE) exists
- [ ] Verify dist/index.d.ts exists
- [ ] Verify all .map source maps exist

### Task 3: Measure Bundle Sizes

- [ ] Measure core package gzipped size
- [ ] Document sizes in README
- [ ] Verify < 20kb for core
- [ ] Create size measurement script if needed

### Task 4: Document Build Process

- [ ] Update README with build info
- [ ] Document multi-format support
- [ ] Add bundle size badges (optional)
- [ ] Document import methods for each format

---

## Prerequisites

**Story 3.1: Package Metadata & npm Configuration** - backlog

---

## Dependencies

**Blocks:**

- Story 3.3: Publishing Automation

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 5**: tsup multi-format output
- **FR48**: Package bundles in ESM, CommonJS, UMD formats
- **FR49**: Minified production builds
- **FR50**: Source maps included
- **FR51**: Bundle size under 50kb gzipped per game
- **FR54**: Dev and prod versions

### tsup Configuration

Already configured in Story 1.3/2.1:

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
});
```

### Import Examples

**ESM (Modern bundlers):**

```javascript
import { BaseGame } from "@minigame/core";
```

**CommonJS (Node.js):**

```javascript
const { BaseGame } = require("@minigame/core");
```

**Browser (CDN):**

```html
<script src="https://unpkg.com/@minigame/core"></script>
<script>
  const game = new MinigameCore.BaseGame(canvas);
</script>
```

### Bundle Size Measurement

```bash
# Measure gzipped size
gzip -c dist/index.js | wc -c
gzip -c dist/index.cjs | wc -c
gzip -c dist/index.global.js | wc -c
```

Or use bundlesize package:

```json
{
  "bundlesize": [
    {
      "path": "./packages/core/dist/index.js",
      "maxSize": "20 kB"
    }
  ]
}
```

---

## Definition of Done

- [ ] All packages have tsup configured for multi-format
- [ ] ESM, CJS, IIFE builds verified
- [ ] Source maps present for all formats
- [ ] Minification enabled
- [ ] Bundle sizes measured and documented
- [ ] Core < 20kb, games < 50kb gzipped
- [ ] Import methods documented
- [ ] Git commit with build verification

---

## Related FRs

- **FR48**: Multi-format builds (ESM, CJS, UMD)
- **FR49**: Minified production builds
- **FR50**: Source maps included
- **FR51**: Bundle size < 50kb gzipped per game
- **FR54**: Dev and prod versions

---

## Dev Notes

### Why Multiple Formats?

- **ESM**: Tree-shaking, modern bundlers (Vite, Webpack 5+)
- **CJS**: Node.js compatibility, older tools
- **IIFE**: Direct browser usage, CDN support

### Minification

tsup uses esbuild for fast, efficient minification:

- Removes whitespace
- Mangles variable names
- Dead code elimination
- Typically 60-70% size reduction

### Source Maps

Source maps enable:

- Debugging minified code
- Stack traces show original TypeScript
- Browser DevTools integration

### Bundle Size Targets

- **Core**: < 20kb (framework is small)
- **Games**: < 50kb (including game logic)
- Measured gzipped (network transfer)

### Next Story Context

After this story, Story 3.3 will set up automated publishing to npm using Changesets with semantic versioning.

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
