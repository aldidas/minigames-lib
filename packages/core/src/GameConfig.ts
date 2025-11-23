import type { GameConfig } from './types';

/**
 * Default game configuration with sensible defaults
 * Can be partially overridden when creating a game instance
 */
export const defaultGameConfig: GameConfig = {
  colors: {
    primary: '#3b82f6',      // Modern blue
    secondary: '#8b5cf6',    // Purple accent
    background: '#1f2937',   // Dark gray
    text: '#f9fafb',         // Near white
  },
  typography: {
    fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
    fontSize: {
      small: 12,
      medium: 16,
      large: 24,
    },
  },
  styling: {
    borderRadius: 8,   // Modern rounded corners
    borderWidth: 2,
    shadowBlur: 10,
  },
  animation: {
    speed: 1.0,  // Normal speed (1.0 = 100%)
  },
  audio: {
    volume: 0.7,   // 70% volume
    muted: false,
  },
};

/**
 * Deep merge user config with default config
 * @param userConfig - Partial user configuration
 * @returns Complete GameConfig with merged values
 */
export function mergeConfig(userConfig?: Partial<GameConfig>): GameConfig {
  if (!userConfig) {
    return { ...defaultGameConfig };
  }

  return {
    colors: {
      ...defaultGameConfig.colors,
      ...userConfig.colors,
    },
    typography: {
      ...defaultGameConfig.typography,
      fontSize: {
        ...defaultGameConfig.typography.fontSize,
        ...userConfig.typography?.fontSize,
      },
      ...(userConfig.typography && {
        fontFamily: userConfig.typography.fontFamily || defaultGameConfig.typography.fontFamily,
      }),
    },
    styling: {
      ...defaultGameConfig.styling,
      ...userConfig.styling,
    },
    animation: {
      ...defaultGameConfig.animation,
      ...userConfig.animation,
    },
    audio: {
      ...defaultGameConfig.audio,
      ...userConfig.audio,
    },
  };
}
