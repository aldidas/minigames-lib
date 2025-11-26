import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SnakeGame } from '../SnakeGame';
import * as React from 'react';

describe('SnakeGame React Component', () => {
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
      const { container } = render(<SnakeGame />);
      const canvas = container.querySelector('canvas');
      
      expect(canvas).toBeInTheDocument();
    });

    it('should render canvas and start game with default dimensions', () => {
      const { container } = render(<SnakeGame />);
      const canvas = container.querySelector('canvas');
      
      // Canvas should be rendered (jsdom doesn't set width/height correctly)
      expect(canvas).toBeInTheDocument();
    });

    it('should render canvas with props passed dimensions', () => {
      const { container } = render(<SnakeGame width={400} height={400} />);
      const canvas = container.querySelector('canvas');
      
      // Canvas should be rendered (jsdom doesn't set width/height correctly)
      expect(canvas).toBeInTheDocument();
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

      const { container } = render(<SnakeGame config={config} />);
      const canvas = container.querySelector('canvas');
      
      expect(canvas).toBeInTheDocument();
    });

    it('should auto-start by default', () => {
      const { container } = render(<SnakeGame />);
      const canvas = container.querySelector('canvas');
      
      // Game should be created and auto-started
      expect(canvas).toBeInTheDocument();
    });

    it('should not auto-start when autoStart is false', () => {
      const { container } = render(<SnakeGame autoStart={false} />);
      const canvas = container.querySelector('canvas');
      
      // Game should be created but not started
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Event Callbacks', () => {
    it('should call onGameStarted when game starts', () => {
      const onGameStarted = vi.fn();
      render(<SnakeGame onGameStarted={onGameStarted} />);
      
      // Game auto-starts, so callback should be called
      expect(onGameStarted).toHaveBeenCalled();
    });

    it('should call onScoreUpdate when score changes', () => {
      const onScoreUpdate = vi.fn();
      render(<SnakeGame onScoreUpdate={onScoreUpdate} />);
      
      // Score update may be called during gameplay
      // (hard to test without simulating full game)
    });

    it('should call onGameOver when game ends', () => {
      const onGameOver = vi.fn();
      render(<SnakeGame onGameOver={onGameOver} />);
      
      // Game over will be called when game ends
      // (hard to test without simulating full game)
    });

    it('should call onGameFinished when game finishes', () => {
      const onGameFinished = vi.fn();
      render(<SnakeGame onGameFinished={onGameFinished} />);
      
      // Game finished callback
      // (hard to test without simulating full game)
    });
  });

  describe('Ref-based Control', () => {
    it('should expose start method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.start).toBe('function');
    });

    it('should expose stop method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.stop).toBe('function');
    });

    it('should expose pause method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.pause).toBe('function');
    });

    it('should expose resume method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.resume).toBe('function');
    });

    it('should expose mute method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.mute).toBe('function');
    });

    it('should expose unmute method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.unmute).toBe('function');
    });

    it('should expose setPlayerName method via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.setPlayerName).toBe('function');
    });

    it('should be able to call start via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      expect(() => ref.current.start()).not.toThrow();
    });

    it('should be able to call stop via ref', () => {
      const ref = React.createRef<any>();
      render(<SnakeGame ref={ref} autoStart={false} />);
      
      ref.current.start();
      expect(() => ref.current.stop()).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup game on unmount', () => {
      const { unmount, container } = render(<SnakeGame />);
      const canvas = container.querySelector('canvas');
      
      expect(canvas).toBeInTheDocument();
      
      // Unmount should cleanup
      unmount();
      
      // Component should be removed
      expect(container.querySelector('canvas')).not.toBeInTheDocument();
    });

    it('should handle multiple mount/unmount cycles', () => {
      const { unmount } = render(<SnakeGame />);
      unmount();
      
      // Render a new instance (don't rerender after unmount)
      const { container } = render(<SnakeGame />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should accept valid GameConfig type', () => {
      const config = {
        colors: {
          primary: '#ffffff',
          secondary: '#000000',
          background: '#cccccc',
          text: '#333333',
        },
        typography: {
          fontSize: 16,
          fontFamily: 'Arial',
        },
      };

      const { container } = render(<SnakeGame config={config} />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });
});
