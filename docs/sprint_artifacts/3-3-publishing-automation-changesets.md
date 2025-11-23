# Story 3.3: Publishing Automation with Changesets

**Epic:** Build & Distribution Pipeline  
**Story ID:** 3.3  
**Story Key:** 3-3-publishing-automation-changesets  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a package maintainer,  
I want automated publishing to npm,  
So that releases are consistent and follow semantic versioning.

---

## Acceptance Criteria

### AC1: Changeset Workflow

**Given** Changesets is configured (Story 1.5)  
**When** I use the changeset workflow  
**Then**:

- `pnpm changeset` creates changeset files for tracking changes
- Changesets describe what changed and semver bump type
- Multiple changesets can accumulate before release
- Changeset files committed to Git

### AC2: Version Bumping

**Given** changesets exist  
**When** I run `pnpm changeset version`  
**Then**:

- Breaking changes trigger major bump (FR63)
- New features trigger minor bump (FR64)
- Bug fixes trigger patch bump (FR65)
- All packages get synchronized versions (FR47)
- Changelogs auto-generated from changesets (FR67)
- Consumed changesets deleted

### AC3: Publishing to npm

**Given** versions bumped  
**When** I publish packages  
**Then**:

- `pnpm changeset publish` publishes to npm
- Git tags created for each release (FR68)
- All packages published together
- Migration guide template available for breaking changes (FR66)
- Publishing process documented

---

## Tasks & Subtasks

### Task 1: Verify Changesets Configuration

- [ ] Review .changeset/config.json from Story 1.5
- [ ] Confirm fixed versioning for @minigame/\*
- [ ] Verify changelog generation enabled
- [ ] Check git tagging enabled

### Task 2: Document Changeset Workflow

- [ ] Create CONTRIBUTING.md with changeset process
- [ ] Document creating changesets
- [ ] Document version bumping
- [ ] Document publishing process
- [ ] Add examples for major/minor/patch

### Task 3: Create Migration Guide Template

- [ ] Create docs/MIGRATION_TEMPLATE.md
- [ ] Include sections for breaking changes
- [ ] Include upgrade steps
- [ ] Add example migration guide

### Task 4: Test Publishing Workflow (Dry Run)

- [ ] Create test changeset
- [ ] Run `pnpm changeset version` (dry run)
- [ ] Verify version bumps
- [ ] Verify changelog generation
- [ ] Clean up test changeset

---

## Prerequisites

**Story 1.5: Versioning Setup (Changesets)** - DONE ✅  
**Story 3.1: Package Metadata & npm Configuration** - backlog  
**Story 3.2: Multi-Format Build Configuration** - backlog

---

## Dependencies

**Blocks:**

- Actual npm publishing
- Epic 4 game implementations (need publishing for distribution)

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **Decision 9**: Changesets for versioning + automated npm publishing
- **FR46**: Semantic versioning (major.minor.patch)
- **FR47**: All packages use consistent version numbers
- **FR63-FR68**: Complete versioning requirements

### Changeset Workflow

**1. Create changeset:**

```bash
pnpm changeset
# Interactive prompts:
# - Select packages changed
# - Select bump type (major/minor/patch)
# - Write summary
```

**2. Commit changeset:**

```bash
git add .changeset/*.md
git commit -m "chore: add changeset for feature X"
```

**3. Version packages:**

```bash
pnpm changeset version
# Updates package.json versions
# Generates CHANGELOG.md
# Deletes consumed changesets
```

**4. Commit version bump:**

```bash
git add .
git commit -m "chore: version packages"
```

**5. Publish to npm:**

```bash
pnpm build  # Build all packages
pnpm changeset publish  # Publish to npm
git push --follow-tags  # Push with tags
```

### Semantic Versioning Rules

- **Major (1.0.0 → 2.0.0)**: Breaking changes (FR63)

  - API removed or changed
  - Behavior changed incompatibly
  - Requires user code changes

- **Minor (1.0.0 → 1.1.0)**: New features (FR64)

  - New API added
  - New functionality
  - Backwards compatible

- **Patch (1.0.0 → 1.0.1)**: Bug fixes (FR65)
  - Bug fixed
  - No API changes
  - Backwards compatible

### Migration Guide Template

````markdown
# Migration Guide: v1.x → v2.0

## Breaking Changes

### API Changes

**Removed:**

- `oldMethod()` - Use `newMethod()` instead

**Changed:**

- `configure(options)` - Now requires `required` property

### Behavior Changes

- Game loop now uses `deltaTime` in seconds (was milliseconds)

## Migration Steps

1. Update method calls
2. Update configuration objects
3. Test your integration
4. Update to v2.0.0

## Example

**Before (v1.x):**

```typescript
game.oldMethod();
game.configure({ optional: true });
```
````

**After (v2.0):**

```typescript
game.newMethod();
game.configure({ required: true, optional: true });
```

````

### Publishing Best Practices

- **Version before publish**: Always run `changeset version` before `changeset publish`
- **Build before publish**: Always run `pnpm build` before publishing
- **Test first**: Test packages locally before publishing
- **Check npm**: Verify packages appear on npm after publishing
- **Announce**: Tweet/blog about major releases

---

## Definition of Done

- [ ] Changesets configuration verified
- [ ] Changeset workflow documented in CONTRIBUTING.md
- [ ] Migration guide template created
- [ ] Semver rules documented
- [ ] Publishing process documented
- [ ] Dry run tested successfully
- [ ] All documentation committed
- [ ] Git commit with publishing automation docs

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

Changesets provides:
- **Semantic versioning enforcement**
- **Automatic changelog generation**
- **Git tag management**
- **Monorepo support** (fixed/independent versioning)
- **Developer-friendly workflow**

### Fixed vs Independent Versioning

We use **fixed versioning**:
- All @minigame/* packages share same version
- Simpler for users (consistent versions)
- Some packages may get version bumps without changes
- Easier dependency management

Alternative: **Independent versioning**
- Each package has own version
- More complex but more granular

### npm Authentication

Before first publish, authenticate:
```bash
npm login
# Or set NPM_TOKEN in CI/CD
````

### Next Epic Context

After this story, Epic 3 (Build & Distribution Pipeline) is COMPLETE! The next epic (Epic 4: MVP Game Implementations) will create actual games using the @minigame/core package.

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
