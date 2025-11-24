import { defineComponent, ref, onMounted, onUnmounted, watch, type PropType } from 'vue';
import { PongGame as PongGameVanilla } from '@minigame/pong';
import type { GameConfig } from '@minigame/core';

/**
 * Vue 3 wrapper component for Pong game
 * 
 * @example
 * ```vue
 * <PongGame
 *   :config="{ colors: { primary: '#10b981' } }"
 *   @score-update="handleScoreUpdate"
 * />
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
    }
  },
  emits: ['game-started', 'game-over', 'score-update', 'game-finished'],
  setup(props, { emit }) {
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
      
      // Start the game
      game.value.start();
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
    
    return { canvasRef };
  },
  template: '<canvas ref="canvasRef" :width="width" :height="height"></canvas>'
});
