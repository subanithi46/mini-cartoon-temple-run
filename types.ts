
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  GDD = 'GDD'
}

export enum Lane {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export enum ObstacleType {
  LOG = 'LOG', // Slide under
  FIRE_PIT = 'FIRE_PIT', // Jump over
  STUMP = 'STUMP' // Avoid/Jump
}

export interface Obstacle {
  id: number;
  type: ObstacleType;
  lane: Lane;
  y: number; // Position from top (0) to bottom (canvas height)
  passed: boolean;
}

export interface Coin {
  id: number;
  lane: Lane;
  y: number;
  collected: boolean;
}

export interface Player {
  lane: Lane;
  visualX: number; // For smooth lane switching animation
  y: number; // Vertical position (ground is 0)
  isJumping: boolean;
  isSliding: boolean;
  jumpVelocity: number;
  slideTimer: number;
}
