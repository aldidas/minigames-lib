# Story 1.4: Development Scripts & Tooling

**Epic:** Foundation & Infrastructure  
**Story ID:** 1.4  
**Story Key:** 1-4-development-scripts-tooling  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want shared development scripts at the root level,  
So that I can build, test, and lint all packages with single commands.

---

## Acceptance Criteria

### AC1: Workspace Build Scripts

**Given** build tools are set up  
**When** I configure root package.json scripts  
**Then**:

- `pnpm build` runs build across all packages (pnpm -r run build)
- Recursive script execution works correctly (FR77)
- Build scripts inherit from workspace configuration
- Clean script removes all dist/ directories

### AC2: Development Workflow Scripts

**Given** workspace scripts are configured  
**When** I use development commands  
**Then**:

- `pnpm dev` or `pnpm build:watch` enables watch mode across packages
- Development mode supports hot reload (HMR) via tsup --watch
- Local package linking works via workspace protocol
- Watch mode rebuilds only changed packages

### AC3: Testing and Quality Scripts

**Given** the monorepo is configured  
**When** I set up testing scripts  
**Then**:

- `pnpm test` prepared for future Vitest configuration
- `pnpm lint` prepared for future ESLint configuration
- Scripts support package-specific execution via filtering
- Root scripts delegate to package-level scripts

---

## Tasks & Subtasks

### Task 1: Update Root Package Scripts

- [ ] Update root `package.json` with workspace scripts
- [ ] Add `build` script: `pnpm -r run build`
- [ ] Add `dev` or `build:watch` script: `pnpm -r run dev`
- [ ] Add `clean` script: `pnpm -r run clean`
- [ ] Add `test` placeholder script
- [ ] Add `lint` placeholder script

### Task 2: Document Script Usage

- [ ] Update README.md with available scripts
- [ ] Document recursive script execution pattern
- [ ] Explain workspace protocol for local dependencies
- [ ] Add examples of package filtering

### Task 3: Verify Workspace Scripts

- [ ] Test `pnpm build` runs across all packages
- [ ] Verify clean script removes all dist/ directories
- [ ] Confirm workspace protocol works for inter-package deps
- [ ] Validate scripts work from root and package directories

---

## Prerequisites

**Story 1.1: Monorepo Initialization** - DONE ✅  
**Story 1.2: TypeScript Configuration** - DONE ✅  
**Story 1.3: Build Tool Setup (tsup)** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 1.5: Versioning Setup (Changesets)
- All package development workflows

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR74**: Shared build configuration centralized in root
- **FR77**: Development mode supports local testing across packages
- **Architecture**: pnpm workspace for monorepo management

### Root Package.json Scripts

**File: `package.json` (scripts section)**

```json
{
  "scripts": {
    "build": "pnpm -r run build",
    "dev": "pnpm -r run dev",
    "clean": "pnpm -r run clean",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint"
  }
}
```

### Package-Level Scripts Pattern

Each package should have:

```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  }
}
```

### Workspace Script Execution

**Recursive execution across all packages:**

```bash
pnpm -r run build    # Build all packages
pnpm -r run clean    # Clean all packages
pnpm -r run dev      # Watch mode for all packages
```

**Filter by package:**

```bash
pnpm --filter @minigame/core build
pnpm --filter @minigame/snake dev
```

**Parallel execution:**

```bash
pnpm -r --parallel run dev   # Watch all packages in parallel
```

### Development Workflow

**Typical development flow:**

1. **Start development:**

   ```bash
   pnpm dev   # Starts watch mode for all packages
   ```

2. **Build for production:**

   ```bash
   pnpm clean && pnpm build
   ```

3. **Test changes:**
   ```bash
   pnpm test
   ```

### Workspace Protocol

Inter-package dependencies use `workspace:` protocol:

```json
{
  "dependencies": {
    "@minigame/core": "workspace:^"
  }
}
```

This ensures:

- Always uses local version during development
- Replaced with actual version on publish
- Hot reload works across dependent packages

---

## Definition of Done

- [ ] Root package.json updated with all workspace scripts
- [ ] `pnpm build` works across all packages
- [ ] `pnpm clean` removes all dist/ directories
- [ ] `pnpm dev` or `pnpm build:watch` enables watch mode
- [ ] Workspace protocol documented
- [ ] README.md updated with script usage
- [ ] All scripts tested and verified working
- [ ] Git commit with development scripts

---

## Related FRs

- **FR74**: Shared build configuration centralized in root
- **FR77**: Development mode supports local testing across packages

---

## Dev Notes

### Why pnpm -r?

The `-r` (recursive) flag:

- Runs script in all workspace packages
- Respects package dependencies order
- Fails fast if any package fails
- Essential for monorepo workflows

### Watch Mode Benefits

tsup --watch provides:

- **Fast rebuilds**: Only rebuilds on file changes
- **HMR**: Hot module replacement
- **Multi-package**: Works across workspace
- **Developer experience**: Instant feedback

### Future Enhancements

Stories to add later:

- **Testing**: Vitest configuration (post-Epic 1)
- **Linting**: ESLint + Prettier setup (post-Epic 1)
- **Type checking**: `pnpm typecheck` script
- **Pre-commit hooks**: Husky + lint-staged

### Next Story Context

After this story, Story 1.5 will add Changesets for versioning and changelog management, completing the foundation infrastructure.

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
