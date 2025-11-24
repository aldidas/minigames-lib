# Story 6.2: Vue Wrapper Package

**Epic:** Framework Integrations  
**Story ID:** 6.2  
**Story Key:** 6-2-vue-wrapper-package  
**Status:** drafted  
**Created:** 2025-11-24

---

## User Story

As a Vue developer,  
I want Vue 3 component wrappers for all games,  
So that I can use games as native Vue components with reactive props and emits.

---

## Acceptance Criteria

### AC1: Package Structure & Configuration

**Given** the monorepo structure exists  
**When** I create the Vue wrapper package  
**Then**:

- `packages/vue/` directory created following monorepo pattern
- `package.json` configured:
  - name: "@minigame/vue" (FR88)
  - peerDependencies: "vue": "^3.3.0" (FR89)
  - dependencies: @minigame/core, @minigame/snake, @minigame/pong, @minigame/breakout
  - version: 1.0.0 (synced with monorepo)
- `tsconfig.json` extends root with Vue types
- `tsup.config.ts` for ESM/CJS/IIFE builds
- `src/index.ts` as entry point
- No Vue 2 support (FR87)

### AC2: Vue Component Implementation

**Given** all MVP games are complete  
**When** I implement Vue components  
**Then**:

- Vue 3 Composition API used internally (FR85)
- Component syntax for template usage (FR86)
- Three components exported (FR81):
  - `SnakeGame`
  - `PongGame`
  - `BreakoutGame`
- Each component:
  - Uses `defineComponent` from Vue 3
  - Manages canvas with template ref
  - Cleans up on `onUnmounted`

### AC3: Props & Events

**Given** Vue components are implemented  
**When** I use a component  
**Then**:

- Props interface includes (FR82):
  - `config?: Partial<GameConfig>`
- Component emits Vue events (FR83):
  - `@game-started`
  - `@game-over`
  - `@score-update`
  - `@game-finished`
- Props are reactive (deep watch on config)

### AC4: TypeScript Support

**Given** TypeScript definitions are needed  
**When** I build the package  
**Then**:

- Full TypeScript support (FR84)
- Exported types:
  - Component types
  - Prop types
  - Emit types
  - Re-export GameConfig from @minigame/core
- IntelliSense works in Vue templates

### AC5: Build & Distribution

**Given** the package is complete  
**When** I build the package  
**Then**:

- ESM output: `dist/index.js`
- CJS output: `dist/index.cjs`
- Type definitions: `dist/index.d.ts`, `dist/index.d.cts`
- Source maps included
- Bundle size < 10kb (wrappers are thin)

### AC6: Testing

**Given** components are implemented  
**When** I write tests  
**Then**:

- Test framework: Vitest + Vue Test Utils (FR90)
- Test coverage:
  - Component mounts with canvas
  - Config prop passed to game instance
  - Events emitted correctly
  - Cleanup on unmount
  - Config changes trigger reinitialization
- All tests passing

### AC7: Documentation

**Given** the package is ready  
**When** I write the README  
**Then**:

- `packages/vue/README.md` includes:
  - Installation instructions
  - Quick start example with SFC
  - Props API reference
  - Events reference
  - TypeScript usage example
  - All three game components documented

---

## Prerequisites

**Story 6.1 Complete:** React wrapper implemented ✅

---

## Technical Notes

### Component Implementation Pattern

```typescript
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  type PropType,
} from "vue";
import { SnakeGame as SnakeGameVanilla } from "@minigame/snake";
import type { GameConfig } from "@minigame/core";

export default defineComponent({
  name: "SnakeGame",
  props: {
    config: {
      type: Object as PropType<Partial<GameConfig>>,
      default: () => ({}),
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  emits: ["game-started", "game-over", "score-update", "game-finished"],
  setup(props, { emit }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const game = ref<SnakeGameVanilla | null>(null);

    onMounted(() => {
      if (!canvasRef.value) return;

      game.value = new SnakeGameVanilla(canvasRef.value, props.config);
      game.value.on("gameStarted", (data: any) => emit("game-started", data));
      game.value.on("gameOver", (data: any) => emit("game-over", data));
      game.value.on("scoreUpdate", (data: any) => emit("score-update", data));
      game.value.on("gameFinished", (data: any) => emit("game-finished", data));
      game.value.start();
    });

    watch(
      () => props.config,
      () => {
        // Reinitialize on config change
        if (game.value && canvasRef.value) {
          game.value.stop();
          game.value = new SnakeGameVanilla(canvasRef.value, props.config);
          game.value.start();
        }
      },
      { deep: true }
    );

    onUnmounted(() => {
      game.value?.stop();
    });

    return { canvasRef };
  },
  template: '<canvas ref="canvasRef" :width="width" :height="height"></canvas>',
});
```

---

## Definition of Done

- [ ] Package structure created in `packages/vue/`
- [ ] All three game components implemented
- [ ] Props and events working correctly
- [ ] Full TypeScript support with exported types
- [ ] Build outputs (ESM, CJS, types) generated
- [ ] Tests written and passing (FR90)
- [ ] README.md complete with examples
- [ ] Bundle size verified < 10kb
- [ ] Manually tested in example Vue app
- [ ] Git commit with implementation

---

## Related FRs

- **FR81-FR89**: Vue wrapper requirements
- **FR90**: Framework wrapper testing

---

## Change Log

| Date       | Version | Changes                | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-11-24 | 1.0     | Initial story creation | SM (Bob) |
