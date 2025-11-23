# Contributing to minigames-lib

Thank you for contributing to minigames-lib! This document explains the development workflow.

## Development Setup

```bash
# Clone and install
git clone https://github.com/aldidas/minigames-lib.git
cd minigames-lib
pnpm install

# Build all packages
pnpm build

# Watch mode for development
pnpm dev
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Your Changes

- Write code in the appropriate package
- Follow TypeScript best practices
- Add tests if applicable
- Update documentation

### 3. Build and Test

```bash
# Build all packages
pnpm build

# Run tests (when available)
pnpm test

# Lint code (when available)
pnpm lint
```

## Creating a Changeset

We use [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### When to Create a Changeset

Create a changeset for **every meaningful change**:

- ✅ New features
- ✅ Bug fixes
- ✅ Breaking changes
- ❌ Documentation-only changes
- ❌ Internal refactoring (no user impact)

### How to Create a Changeset

```bash
pnpm changeset
```

You'll be prompted for:

1. **Which packages changed?** - Select affected packages
2. **Bump type?** - Select major, minor, or patch (see Semantic Versioning below)
3. **Summary** - Describe the change (appears in changelog)

### Semantic Versioning

Choose the correct bump type:

**Major (Breaking Change)**

- API removed or changed incompatibly
- Behavior changed in backwards-incompatible way
- Requires users to update their code

Example: Renaming `game.start()` to `game.begin()`

**Minor (New Feature)**

- New API added
- New functionality added
- Backwards compatible

Example: Adding `game.reset()` method

**Patch (Bug Fix)**

- Bug fixed
- No API changes
- Backwards compatible

Example: Fixing game loop timing issue

### Changeset Example

**Patch (Bug Fix):**

```
---
"@minigame/core": patch
---

Fix game loop timing issue when browser tab is inactive
```

**Minor (Feature):**

```
---
"@minigame/core": minor
---

Add reset() method to BaseGame for restarting games
```

**Major (Breaking Change):**

```
---
"@minigame/core": major
"@minigame/snake": major
---

BREAKING: Rename start() to begin() for consistency

Migration: Replace all `game.start()` calls with `game.begin()`
```

## Submitting Changes

### 1. Commit Changeset

```bash
git add .changeset/*.md
git commit -m "feat: add new feature"
```

### 2. Push and Create PR

```bash
git push origin feature/my-feature
```

Then create a Pull Request on GitHub.

### 3. PR Review

- Maintainers will review your code
- Address any feedback
- Once approved, PR will be merged

## Releasing (Maintainers Only)

### 1. Version Packages

```bash
# This will:
# - Bump package versions based on changesets
# - Generate changelogs
# - Delete consumed changesets
pnpm changeset version
```

### 2. Commit Version Bumps

```bash
git add .
git commit -m "chore: version packages"
git push
```

### 3. Build Packages

```bash
pnpm build
```

### 4. Publish to npm

```bash
# This will:
# - Publish packages to npm
# - Create git tags
pnpm changeset publish

# Push tags
git push --follow-tags
```

## Package Structure

```
minigames-lib/
├── packages/
│   └── core/           # @minigame/core - Framework
│       ├── src/
│       ├── package.json
│       └── tsup.config.ts
├── docs/               # Documentation
├── .changeset/         # Changesets
└── package.json        # Root workspace
```

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use strict type checking (no `any`)

## Questions?

Open an issue or reach out to maintainers!
