import type { GameEvent, EventCallback, BaseEventData } from './types';

/**
 * Type-safe event emitter for game events
 * Manages event subscriptions and emissions
 */
export class EventEmitter {
  private listeners: Map<GameEvent, Set<EventCallback>> = new Map();

  /**
   * Subscribe to a game event
   * @param event - The event type to listen for
   * @param callback - Function to call when event is emitted
   * @example
   * emitter.on('gameStarted', (data) => {
   *   console.log('Game started at', data.timestamp);
   * });
   */
  public on(event: GameEvent, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from a game event
   * @param event - The event type to stop listening for
   * @param callback - The specific callback to remove
   * @example
   * emitter.off('gameStarted', myCallback);
   */
  public off(event: GameEvent, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit a game event to all subscribers
   * Protected - only called by game implementations
   * @param event - The event type to emit
   * @param data - Optional event data
   */
  protected emit(event: GameEvent, data?: BaseEventData): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data || { timestamp: new Date().toISOString() });
        } catch (error) {
          // Log error but don't break other callbacks
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }
}
