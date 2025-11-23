# Story 1.5: Versioning Setup (Changesets)

**Epic:** Foundation & Infrastructure  
**Story ID:** 1.5  
**Story Key:** 1-5-versioning-setup-changesets  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a developer,  
I want Changesets configured for version management,  
So that I can automate semantic versioning and changelog generation.

---

## Acceptance Criteria

### AC1: Changesets Installation and Configuration

**Given** the monorepo is set up  
**When** I configure Changesets  
**Then**:

- @changesets/cli installed as root devDependency
- .changeset/config.json exists with fixed versioning strategy
- .changeset/README.md explains changeset workflow
- Git ignore configured for .changeset pre-commit files

### AC2: Version Management Workflow

**Given** Changesets is installed  
**When** I use versioning commands  
**Then**:

- `pnpm changeset` creates changeset files (FR67)
- `pnpm changeset version` bumps versions correctly:
  - Breaking changes → major bump (FR63)
  - Features → minor bump (FR64)
  - Fixes → patch bump (FR65)
- All packages use synchronized versions (FR47)
- Changelog generation configured (FR67)

### AC3: Publishing Configuration

**Given** Changesets is configured  
**When** I prepare for publishing  
**Then**:

- `pnpm changeset publish` workflow documented
- Git tagging enabled for releases (FR68)
- npm publish configured via package.json publishConfig
- Fixed versioning keeps all packages in sync

---

## Tasks & Subtasks

### Task 1: Install Changesets

- [ ] Add @changesets/cli as root devDependency
- [ ] Verify changesets installation: `npx changeset --version`
- [ ] Review Changesets documentation

### Task 2: Initialize Changesets Configuration

- [ ] Run `npx changeset init`
- [ ] Configure .changeset/config.json:
  - Set fixed versioning (all packages same version)
  - Configure changelog generation
  - Set commit message format
  - Enable git tagging
- [ ] Create .changeset/README.md with workflow docs

### Task 3: Update Package Scripts

- [ ] Add `changeset` script to root package.json
- [ ] Add `version-packages` script
- [ ] Add `release` script (optional)
- [ ] Document changeset workflow in root README

### Task 4: Verify Changesets Workflow

- [ ] Create test changeset file
- [ ] Verify `pnpm changeset version` bumps versions
- [ ] Confirm all packages get same version (fixed)
- [ ] Validate changelog generation
- [ ] Test git tagging (without publishing)
- [ ] Clean up test changeset

---

## Prerequisites

**Story 1.1: Monorepo Initialization** - DONE ✅  
**Story 1.2: TypeScript Configuration** - DONE ✅  
**Story 1.3: Build Tool Setup (tsup)** - DONE ✅  
**Story 1.4: Development Scripts & Tooling** - backlog

---

## Dependencies

**Blocks:**

- Story 3.3: Publishing Automation with Changesets
- All package release workflows

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 9**: Changesets for versioning + automated npm publishing
- **FR46**: Semantic versioning (major.minor.patch)
- **FR47**: All packages use consistent version numbers (synchronized)
- **FR63-FR68**: Complete versioning requirements

### Changesets Configuration

**File: `.changeset/config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [["@minigame/*"]],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Key settings explained:**

- `"fixed": [["@minigame/*"]]` - All @minigame packages share same version
- `"commit": false` - Don't auto-commit (user controls git)
- `"access": "public"` - Packages are public on npm
- `"changelog": "@changesets/cli/changelog"` - Auto-generate changelogs

### Package.json Scripts

**Add to root `package.json`:**

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

### Changesets Workflow

**1. Making changes:**

```bash
# After making code changes
pnpm changeset
# Answer prompts:
# - What type of change? (major/minor/patch)
# - Summary of changes
```

**2. Versioning:**

```bash
# When ready to create a new version
pnpm version-packages
# This will:
# - Bump version in all package.json files
# - Update CHANGELOG.md files
# - Delete consumed changeset files
```

**3. Publishing (manual):**

```bash
# Build and publish to npm
pnpm build
pnpm changeset publish
# This will:
# - Publish packages to npm
# - Create git tags
# - Push tags to remote
```

### Semantic Versioning Rules

Per FR63-FR65:

- **Major (1.0.0 → 2.0.0)**: Breaking changes

  ```bash
  pnpm changeset
  # Select: major
  ```

- **Minor (1.0.0 → 1.1.0)**: New features (backwards compatible)

  ```bash
  pnpm changeset
  # Select: minor
  ```

- **Patch (1.0.0 → 1.0.1)**: Bug fixes
  ```bash
  pnpm changeset
  # Select: patch
  ```

### Fixed Versioning Strategy

All @minigame/\* packages share the same version:

- **Benefit**: Simple dependency management
- **Trade-off**: Some packages may get version bumps without changes
- **Why**: Small monorepo with tightly coupled packages
- **Alternative**: "linked" strategy (packages independently versioned)

### Git Tagging

Changesets automatically creates git tags (FR68):

```
@minigame/core@1.0.0
@minigame/snake@1.0.0
@minigame/pong@1.0.0
```

With fixed versioning, all tags created simultaneously.

### Changelog Format

Auto-generated CHANGELOG.md per package:

```markdown
# @minigame/core

## 1.1.0

### Minor Changes

- abc1234: Added new feature X

### Patch Changes

- def5678: Fixed bug Y
```

---

## Definition of Done

- [ ] @changesets/cli installed as root devDependency
- [ ] .changeset/config.json configured with fixed versioning
- [ ] .changeset/README.md created with workflow docs
- [ ] Root package.json updated with changeset scripts
- [ ] Changeset workflow tested (create, version, verify)
- [ ] Changelog generation confirmed working
- [ ] Git tagging verified (test mode)
- [ ] Documentation updated in root README
- [ ] Git commit with changesets setup

---

## Related FRs

- **FR46**: Semantic versioning (major.minor.patch)
- **FR47**: All packages use consistent version numbers
- **FR63**: Breaking changes trigger major version bump
- **FR64**: New features trigger minor version bump
- **FR65**: Bug fixes trigger patch version bump
- **FR66**: Migration guides provided for breaking changes
- **FR67**: Changelog auto-generated from changesets
- **FR68**: Version numbers used as git tags

---

## Dev Notes

### Why Changesets?

**Benefits:**

- **Semantic versioning**: Enforces proper version bumps
- **Changelog generation**: Automatic from changeset files
- **Git integration**: Auto-tagging, clean history
- **Monorepo support**: Fixed or independent versioning
- **Developer-friendly**: Simple CLI workflow
- **npm integration**: Seamless publishing

**Alternatives considered:**

- **Lerna**: More complex, overkill for our needs
- **Manual**: Error-prone, no automation
- **semantic-release**: Less flexible for monorepos

### Migration Guides (FR66)

For breaking changes, create detailed migration guides:

```markdown
# Migration Guide: v1 → v2

## Breaking Changes

### Renamed API methods

- `game.init()` → `game.initialize()`

### Changed event names

- `gameStarted` → `game:started`

## Migration Steps

1. Update method calls
2. Update event listeners
3. Test your integration
```

### Publishing Cadence

Recommended workflow:

- **Development**: Frequent changesets
- **Pre-release**: alpha/beta tags
- **Release**: Stable versions from main branch
- **Hotfixes**: Patch releases as needed

### Next Story Context

After this story, Epic 1 (Foundation & Infrastructure) is COMPLETE! The next epic (Epic 2: Core Package - Game Framework) will create the actual @minigame/core package using all this infrastructure.

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
