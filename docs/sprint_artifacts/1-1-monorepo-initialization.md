# Story 1.1: Monorepo Initialization

**Epic:** Foundation & Infrastructure  
**Story ID:** 1.1  
**Story Key:** 1-1-monorepo-initialization  
**Status:** drafted  
**Created:** 2025-11-23

---

## User Story

As a developer,  
I want a properly configured pnpm monorepo,  
So that I can develop multiple packages efficiently in one repository.

---

## Acceptance Criteria

### AC1: Workspace Configuration

**Given** a new project directory  
**When** I initialize the monorepo structure  
**Then**:

- pnpm-workspace.yaml exists and defines `packages/*` pattern
- Root package.json exists with workspace configuration
- packages/ directory exists for all packages
- .gitignore excludes node_modules, dist, and build artifacts
- package.json includes workspace scripts (build, test, lint)

### AC2: Directory Structure

**Given** the workspace is initialized  
**When** I verify the directory structure  
**Then**:

- Root directory contains: `pnpm-workspace.yaml`, `package.json`, `.gitignore`, `packages/`
- packages/ directory is empty and ready for package creation
- .gitignore includes: `node_modules/`, `dist/`, `*.log`, `.DS_Store`

### AC3: pnpm Configuration

**Given** pnpm workspace is set up  
**When** I run workspace commands  
**Then**:

- `pnpm install` works at root level
- pnpm workspace protocol is available for inter-package dependencies
- Shared devDependencies can be installed at root
- Package-specific dependencies can be installed within packages/

---

## Tasks & Subtasks

### Task 1: Initialize Repository

- Create project directory `minigames-lib`
- [ ] Initialize git repository: `git init`
- [ ] Create initial README.md with project description

### Task 2: Configure pnpm Workspace

- [ ] Create `pnpm-workspace.yaml` with packages pattern
- [ ] Initialize root `package.json` with name: `minigames-lib`
- [ ] Set `"private": true` in root package.json (monorepo root should not be published)
- [ ] Add `"type": "module"` for ESM support

### Task 3: Create Directory Structure

- [ ] Create `packages/` directory
- [ ] Add `.gitignore` excluding build artifacts and dependencies
- [ ] Create `.npmrc` for pnpm configuration (if needed)

### Task 4: Add Workspace Scripts

- [ ] Add `"scripts"` section to root package.json:
  - `"build": "pnpm -r run build"` (recursive build)
  - `"test": "pnpm -r run test"` (recursive test)
  - `"clean": "pnpm -r run clean"` (clean all packages)

### Task 5: Verify Setup

- [ ] Run `pnpm install` successfully
- [ ] Verify workspace commands work (`pnpm -r`)
- [ ] Commit initial repository structure

---

## Prerequisites

**None** - This is the first story in the project.

---

## Dependencies

**Blocks:**

- Story 1.2: TypeScript Configuration
- All subsequent stories

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 1 (Monorepo Structure)**: Feature-based package organization with shared core
- **FR73**: Project uses pnpm workspace for monorepo management
- **FR74**: Shared build configuration centralized in root package
- **FR75**: All packages follow consistent directory structure

### pnpm Workspace Configuration

**File: `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
```

**File: Root `package.json` (excerpt)**

```json
{
  "name": "minigames-lib",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "clean": "pnpm -r run clean"
  },
  "devDependencies": {}
}
```

**File: `.gitignore`**

```
# Dependencies
node_modules/
.pnpm-store/

# Build output
dist/
*.tsbuildinfo

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
.env
.env.local
```

### Expected Directory Structure After Completion

```
minigames-lib/
├── .git/
├── .gitignore
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── packages/          (empty, ready for packages)
```

### Validation Commands

After completion, these should all work:

```bash
pnpm install          # Installs dependencies
pnpm -r run build     # Would run build in all packages (none yet)
git status            # Shows clean working tree
```

---

## Definition of Done

- [ ] pnpm-workspace.yaml created and configured
- [ ] Root package.json with workspace scripts created
- [ ] packages/ directory exists
- [ ] .gitignore properly configured
- [ ] `pnpm install` runs successfully
- [ ] Git repository initialized and initial commit made
- [ ] README.md describes project purpose
- [ ] All files committed to git

---

## Related FRs

- **FR73**: pnpm workspace for monorepo management
- **FR74**: Shared build configuration centralized in root
- **FR75**: All packages follow consistent directory structure
- **FR77**: Development mode supports local testing across packages

---

## Dev Notes

### Why pnpm?

pnpm was chosen over npm/yarn for:

- **Efficient disk usage**: Content-addressable storage saves disk space
- **Fast installs**: Hardlinks instead of copying files
- **Strict dependencies**: No phantom dependencies from hoisting
- **Workspace protocol**: Clean inter-package dependency management

### Next Story Context

After this story, Story 1.2 will add TypeScript configuration extending from the root. The packages/ directory created here will house all @minigame/\* packages.

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
