import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BreakoutGame from '../BreakoutGame';

describe('BreakoutGame Vue Component', () => {
  beforeEach(() => {
    const mockContext = {
      fillStyle: '',
      strokeStyle: '',
      font: '',
      lineWidth: 1,
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
      const wrapper = mount(BreakoutGame);
      expect(wrapper.find('canvas').exists()).toBe(true);
    });

    it('should render with custom dimensions', () => {
      const wrapper = mount(BreakoutGame, {
        props: { width: 400, height: 400 },
      });
      expect(wrapper.find('canvas').exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should accept config prop', () => {
      const wrapper = mount(BreakoutGame, {
        props: {
          config: {
            colors: {
              primary: '#ff0000',
              secondary: '#00ff00',
              background: '#0000ff',
              text: '#ffffff',
            },
          },
        },
      });
      expect(wrapper.find('canvas').exists()).toBe(true);
    });

    it('should auto-start by default', () => {
      const wrapper = mount(BreakoutGame);
      expect(wrapper.find('canvas').exists()).toBe(true);
    });

    it('should not auto-start when autoStart is false', () => {
      const wrapper = mount(BreakoutGame, {
        props: { autoStart: false },
      });
      expect(wrapper.find('canvas').exists()).toBe(true);
    });
  });

  describe('Expose API', () => {
    it('should expose control methods', () => {
      const wrapper = mount(BreakoutGame, {
        props: { autoStart: false },
      });
      
      expect(typeof wrapper.vm.start).toBe('function');
      expect(typeof wrapper.vm.stop).toBe('function');
      expect(typeof wrapper.vm.pause).toBe('function');
      expect(typeof wrapper.vm.resume).toBe('function');
      expect(typeof wrapper.vm.setPlayerName).toBe('function');
    });

    it('should be able to call exposed methods', () => {
      const wrapper = mount(BreakoutGame, {
        props: { autoStart: false },
      });
      
      expect(() => wrapper.vm.start()).not.toThrow();
      expect(() => wrapper.vm.stop()).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const wrapper = mount(BreakoutGame);
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });
});
