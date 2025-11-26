import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from '../EventEmitter';
import type { GameEvent, EventCallback } from '../types';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('on() - Subscribe to events', () => {
    it('should register a callback for an event', () => {
      const callback = vi.fn();
      emitter.on('gameStarted', callback);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith({ timestamp: '2024-01-01' });
    });

    it('should register multiple callbacks for the same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      emitter.on('gameStarted', callback1);
      emitter.on('gameStarted', callback2);
      emitter.on('gameStarted', callback3);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
      expect(callback3).toHaveBeenCalledOnce();
    });

    it('should register callbacks for different events independently', () => {
      const startedCallback = vi.fn();
      const finishedCallback = vi.fn();

      emitter.on('gameStarted', startedCallback);
      emitter.on('gameFinished', finishedCallback);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(startedCallback).toHaveBeenCalledOnce();
      expect(finishedCallback).not.toHaveBeenCalled();
    });

    it('should not register the same callback twice for the same event', () => {
      const callback = vi.fn();

      emitter.on('gameStarted', callback);
      emitter.on('gameStarted', callback); // Adding same callback again

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      // Should only be called once due to Set behavior
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('off() - Unsubscribe from events', () => {
    it('should remove a callback for an event', () => {
      const callback = vi.fn();

      emitter.on('gameStarted', callback);
      emitter.off('gameStarted', callback);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should only remove the specified callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('gameStarted', callback1);
      emitter.on('gameStarted', callback2);
      emitter.off('gameStarted', callback1);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it('should handle removing non-existent callback gracefully', () => {
      const callback = vi.fn();

      // Should not throw
      expect(() => {
        emitter.off('gameStarted', callback);
      }).not.toThrow();
    });

    it('should handle removing callback for non-existent event gracefully', () => {
      const callback = vi.fn();

      // Should not throw
      expect(() => {
        emitter.off('gameStarted' as GameEvent, callback);
      }).not.toThrow();
    });
  });

  describe('emit() - Emit events to subscribers', () => {
    it('should call all registered callbacks with event data', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const eventData = { timestamp: '2024-01-01', playerName: 'Test Player' };

      emitter.on('scoreUpdate', callback1);
      emitter.on('scoreUpdate', callback2);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('scoreUpdate', eventData);

      expect(callback1).toHaveBeenCalledWith(eventData);
      expect(callback2).toHaveBeenCalledWith(eventData);
    });

    it('should provide default timestamp if no data is passed', () => {
      const callback = vi.fn();

      emitter.on('gameStarted', callback);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted');

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });

    it('should handle errors in callbacks without breaking other callbacks', () => {
      const callback1 = vi.fn(() => {
        throw new Error('Callback 1 error');
      });
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // Spy on console.error
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      emitter.on('gameStarted', callback1);
      emitter.on('gameStarted', callback2);
      emitter.on('gameStarted', callback3);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      // All callbacks should be called even if one throws
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      expect(callback3).toHaveBeenCalled();

      // Error should be logged
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error in event callback'),
        expect.any(Error)
      );

      consoleError.mockRestore();
    });

    it('should not fail when emitting event with no subscribers', () => {
      expect(() => {
        // @ts-expect-error - accessing protected method for testing
        emitter.emit('gameStarted', { timestamp: '2024-01-01' });
      }).not.toThrow();
    });

    it('should handle all event types correctly', () => {
      const events: GameEvent[] = [
        'gameStarted',
        'gameFinished',
        'gameOver',
        'scoreUpdate',
        'soundMuted',
        'soundUnmuted',
      ];

      events.forEach((event) => {
        const callback = vi.fn();
        emitter.on(event, callback);

        // @ts-expect-error - accessing protected method for testing
        emitter.emit(event, { timestamp: '2024-01-01' });

        expect(callback).toHaveBeenCalledOnce();
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle subscribe, emit, unsubscribe workflow', () => {
      const callback = vi.fn();

      // Subscribe
      emitter.on('gameStarted', callback);

      // Emit first time - should be called
      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });
      expect(callback).toHaveBeenCalledTimes(1);

      // Emit second time - should be called again
      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-02' });
      expect(callback).toHaveBeenCalledTimes(2);

      // Unsubscribe
      emitter.off('gameStarted', callback);

      // Emit third time - should NOT be called
      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-03' });
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should support multiple event types with multiple callbacks', () => {
      const startCallback1 = vi.fn();
      const startCallback2 = vi.fn();
      const scoreCallback1 = vi.fn();
      const scoreCallback2 = vi.fn();

      emitter.on('gameStarted', startCallback1);
      emitter.on('gameStarted', startCallback2);
      emitter.on('scoreUpdate', scoreCallback1);
      emitter.on('scoreUpdate', scoreCallback2);

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('gameStarted', { timestamp: '2024-01-01' });

      expect(startCallback1).toHaveBeenCalledOnce();
      expect(startCallback2).toHaveBeenCalledOnce();
      expect(scoreCallback1).not.toHaveBeenCalled();
      expect(scoreCallback2).not.toHaveBeenCalled();

      // @ts-expect-error - accessing protected method for testing
      emitter.emit('scoreUpdate', { timestamp: '2024-01-01' });

      expect(scoreCallback1).toHaveBeenCalledOnce();
      expect(scoreCallback2).toHaveBeenCalledOnce();
    });
  });
});
