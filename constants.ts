
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;

export const LANE_WIDTH = CANVAS_WIDTH / 3;
export const LANE_CENTERS = [
  LANE_WIDTH / 2,
  LANE_WIDTH + LANE_WIDTH / 2,
  LANE_WIDTH * 2 + LANE_WIDTH / 2
];

export const INITIAL_SPEED = 5;
export const MAX_SPEED = 15;
export const SPEED_INCREMENT = 0.001;

export const GRAVITY = 0.8;
export const JUMP_FORCE = 15;
export const SLIDE_DURATION = 60; // frames

export const PLAYER_SIZE = 50;
export const OBSTACLE_WIDTH = 80;
export const OBSTACLE_HEIGHT = 40;

export const COLORS = {
  JUNGLE_GREEN: '#14532d',
  PATH_BROWN: '#451a03',
  ANCIENT_GOLD: '#fbbf24',
  FIRE: '#ef4444',
  LOG: '#78350f',
  STONE: '#4b5563'
};
