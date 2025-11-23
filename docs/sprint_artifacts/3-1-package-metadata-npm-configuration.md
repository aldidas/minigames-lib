# Story 3.1: Package Metadata & npm Configuration

**Epic:** Build & Distribution Pipeline  
**Story ID:** 3.1  
**Story Key:** 3-1-package-metadata-npm-configuration  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a package maintainer,  
I want all package.json files properly configured for npm publishing,  
So that packages are discoverable and installable.

---

## Acceptance Criteria

### AC1: Package.json Metadata

**Given** core package exists  
**When** I configure package metadata  
**Then**:

- Each package.json includes correct scoped name (@minigame/core, @minigame/snake, etc.)
- version: "1.0.0" (synchronized via Changesets)
- type: "module"
- main, module, types fields point to dist outputs
- exports field with import/require/types conditions
- files: ["dist"] to include only build artifacts

### AC2: Publishing Configuration

**Given** package metadata configured  
**When** I set up npm publishing  
**Then**:

- publishConfig: { access: "public" } in each package.json
- Root .npmrc configured for @minigame scope (if needed)
- keywords, description, author, license fields complete
- repository field points to GitHub repo

### AC3: Package Discovery

**Given** publishing config complete  
**When** I verify package.json  
**Then**:

- All required npm fields present
- Proper scoping for organization (@minigame/\*)
- Keywords help discoverability
- README.md exists in each package

---

## Tasks & Subtasks

### Task 1: Update Core Package Metadata

- [ ] Verify @minigame/core package.json
- [ ] Add keywords for discoverability
- [ ] Add repository field
- [ ] Add publishConfig with access: public
- [ ] Verify exports field correct

### Task 2: Create .npmrc (if needed)

- [ ] Determine if .npmrc needed for scope
- [ ] Configure for @minigame scope
- [ ] Document publishing process

### Task 3: Verify All Metadata

- [ ] Check all required fields present
- [ ] Verify version synchronization
- [ ] Test package.json validity
- [ ] Update root README with publishing info

---

## Prerequisites

**Epic 2: Core Package - Game Framework** - DONE ✅

---

## Dependencies

**Blocks:**

- Story 3.2: Multi-Format Build Configuration
- Story 3.3: Publishing Automation

---

## Technical Notes

### Architecture References

**From Architecture Document:**

- **FR42-FR43**: Core and game package naming
- **FR44**: Selective installation via scoped packages
- **FR45**: Core is required dependency for game packages
- **FR47**: Consistent version numbers across packages

### Required package.json Fields

```json
{
  "name": "@minigame/core",
  "version": "1.0.0",
  "description": "Core framework for minigame library",
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
  "keywords": [
    "minigame",
    "core",
    "framework",
    "game",
    "typescript",
    "html5",
    "canvas"
  ],
  "author": "Aldi",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/minigames-lib"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### .npmrc Configuration

May not be needed, but if required for scoped packages:

```
@minigame:registry=https://registry.npmjs.org/
```

---

## Definition of Done

- [ ] All package.json files have complete metadata
- [ ] publishConfig with access: public added
- [ ] keywords for discoverability added
- [ ] repository field configured
- [ ] .npmrc created if needed
- [ ] All fields verified
- [ ] Documentation updated
- [ ] Git commit with npm configuration

---

## Related FRs

- **FR42**: Core package published as @minigame/core
- **FR43**: Game packages published as @minigame/{game-name}
- **FR44**: Selective installation (install only needed games)
- **FR45**: Core is dependency of game packages
- **FR47**: All packages use consistent version numbers

---

## Dev Notes

### Scoped Packages

Using @minigame scope provides:

- **Namespace**: Avoids name conflicts
- **Organization**: All packages grouped together
- **Professional**: Shows organized project

### publishConfig

`"access": "public"` is required for scoped packages to be publicly available on npm (default is restricted).

### Keywords

Good keywords for discoverability:

- minigame, game, html5, canvas
- Specific game names (snake, pong, breakout)
- typescript, framework, embeddable

### Next Story Context

After this story, Story 3.2 will verify multi-format build configurations are complete and validate bundle sizes.

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
