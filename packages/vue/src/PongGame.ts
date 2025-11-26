import { defineComponent, ref, onMounted, onUnmounted, watch, h, type PropType } from 'vue';
import { PongGame as PongGameVanilla } from '@minigame/pong';
import type { GameConfig } from '@minigame/core';

/**
 * Vue 3 wrapper component for Pong game
 * 
 * @example
 * ```vue
 * <template>
 *   <PongGame
 *     ref="gameRef"
 *     :config="{ colors: { primary: '#10b981' } }"
 *     :autoStart="false"
 *     @score-update="handleScoreUpdate"
 *   />
 *   <button @click="gameRef.start()">Start</button>
 * </template>
 * ```
 */
export default defineComponent({
  name: 'PongGame',
  props: {
    /** Game configuration */
    config: {
      type: Object as PropType<Partial<GameConfig>>,
      default: () => ({})
    },
    /** Canvas width */
    width: {
      type: Number,
      default: 600
    },
    /** Canvas height */
    height: {
      type: Number,
      default: 600
    },
    /** Whether to auto-start the game on mount (default: true) */
    autoStart: {
      type: Boolean,
      default: true
    }
  },
  emits: ['game-started', 'game-over', 'score-update', 'game-finished'],
  setup(props, { emit, expose }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const game = ref<PongGameVanilla | null>(null);
    
    const initGame = () => {
      if (!canvasRef.value) return;
      
      // Clean up existing game
      if (game.value) {
        game.value.stop();
      }
      
      // Create new game instance
      game.value = new PongGameVanilla(canvasRef.value, props.config);
      
      // Wire up event emitters
      game.value.on('gameStarted', (data: any) => emit('game-started', data));
      game.value.on('gameOver', (data: any) => emit('game-over', data));
      game.value.on('scoreUpdate', (data: any) => emit('score-update', data));
      game.value.on('gameFinished', (data: any) => emit('game-finished', data));
      
      // Auto-start if enabled
      if (props.autoStart) {
        game.value.start();
      }
    };
    
    onMounted(() => {
      initGame();
    });
    
    // Watch for config changes and reinitialize
    watch(() => props.config, () => {
      initGame();
    }, { deep: true });
    
    onUnmounted(() => {
      game.value?.stop();
    });
    
    // Expose game control methods to parent component
    expose({
      start: () => game.value?.start(),
      stop: () => game.value?.stop(),
      pause: () => game.value?.pause(),
      resume: () => game.value?.resume(),
      mute: () => game.value?.mute(),
      unmute: () => game.value?.unmute(),
      setPlayerName: (name: string) => game.value?.setPlayerName(name),
    });
    
    return { canvasRef };
  },
  render() {
    return h('canvas', {
      ref: 'canvasRef',
      width: this.width,
      height: this.height
    });
  }
});
