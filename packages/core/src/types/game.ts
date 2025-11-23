/**
 * Possible states a game can be in
 */
export type GameState = 'idle' | 'running' | 'paused' | 'finished';

/**
 * Configuration for game appearance and behavior
 */
export interface GameConfig {
  /**
   * Color scheme for the game
   */
  colors: {
    /** Primary color (e.g., for main game elements) */
    primary: string;
    /** Secondary color (e.g., for accents) */
    secondary: string;
    /** Background color */
    background: string;
    /** Text color */
    text: string;
  };

  /**
   * Typography settings
   */
  typography: {
    /** Font family (e.g., 'Arial', 'system-ui') */
    fontFamily: string;
    /** Font sizes for different text elements */
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
  };

  /**
   * Visual styling options
   */
  styling: {
    /** Border radius for rounded corners (px) */
    borderRadius: number;
    /** Border width for game elements (px) */
    borderWidth: number;
    /** Shadow blur amount (px) */
    shadowBlur: number;
  };

  /**
   * Animation settings
   */
  animation: {
    /** Animation speed multiplier (1.0 = normal) */
    speed: number;
  };

  /**
   * Audio settings
   */
  audio: {
    /** Volume level (0.0 - 1.0) */
    volume: number;
    /** Whether audio is muted */
    muted: boolean;
  };
}
