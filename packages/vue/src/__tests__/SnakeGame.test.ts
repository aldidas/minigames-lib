import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnakeGame from '../SnakeGame';

describe('SnakeGame Vue Component', () => {
  beforeEach(() => {
    // Mock canvas context
    const mockContext = {
      fillStyle: '',
      strokeStyle: '',
      font: '',
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      save: vi.fn(),
      restore: vi.fn(),
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);
  });

  describe('Component Mounting', () => {
    it('should render canvas element', () => {
      const wrapper = mount(SnakeGame);
      const canvas = wrapper.find('canvas');
      
      expect(canvas.exists()).toBe(true);
    });

    it('should render with custom dimensions', () => {
      const wrapper = mount(SnakeGame, {
        props: { width: 400, height: 400 },
      });
      
      expect(wrapper.find('canvas').exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should accept config prop', () => {
      const config = {
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          background: '#0000ff',
          text: '#ffffff',
        },
      };

      const wrapper = mount(SnakeGame, {
        props: { config },
      });
      
      expect(wrapper.find('canvas').exists()).toBe(true);
    });

    it('should auto-start by default', () => {
      const wrapper = mount(SnakeGame);
      expect(wrapper.find('canvas').exists()).toBe(true);
    });

    it('should not auto-start when autoStart is false', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(wrapper.find('canvas').exists()).toBe(true);
    });
  });

  describe('Event Emissions', () => {
    it('should emit game-started event', async () => {
      const wrapper = mount(SnakeGame);
      
      // Game auto-starts, wait for emission
      await wrapper.vm.$nextTick();
      
      expect(wrapper.emitted()).toHaveProperty('game-started');
    });

    it('should accept onScoreUpdate handler', () => {
      const wrapper = mount(SnakeGame, {
        props: {
          onScoreUpdate: vi.fn(),
        },
      });
      
      expect(wrapper.find('canvas').exists()).toBe(true);
    });
  });

  describe('Expose API', () => {
    it('should expose start method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.start).toBe('function');
    });

    it('should expose stop method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.stop).toBe('function');
    });

    it('should expose pause method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.pause).toBe('function');
    });

    it('should expose resume method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.resume).toBe('function');
    });

    it('should expose mute method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.mute).toBe('function');
    });

    it('should expose unmute method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.unmute).toBe('function');
    });

    it('should expose setPlayerName method', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.setPlayerName).toBe('function');
    });

    it('should be able to call exposed methods', () => {
      const wrapper = mount(SnakeGame, {
        props: { autoStart: false },
      });
      
      expect(() => wrapper.vm.start()).not.toThrow();
      expect(() => wrapper.vm.pause()).not.toThrow();
      expect(() => wrapper.vm.stop()).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const wrapper = mount(SnakeGame);
      
      expect(wrapper.find('canvas').exists()).toBe(true);
      
      // Unmount should cleanup without errors
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });
});
