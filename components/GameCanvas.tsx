
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, LANE_CENTERS, PLAYER_SIZE, 
  COLORS, INITIAL_SPEED, SPEED_INCREMENT, GRAVITY, 
  JUMP_FORCE, SLIDE_DURATION, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, MAX_SPEED 
} from '../constants';
import { Lane, Obstacle, ObstacleType, Player, Coin } from '../types';

interface GameCanvasProps {
  onGameOver: (score: number, coins: number) => void;
  isPaused: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game state held in refs for the animation loop
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const playerRef = useRef<Player>({
    lane: Lane.MIDDLE,
    visualX: LANE_CENTERS[Lane.MIDDLE],
    y: 0,
    isJumping: false,
    isSliding: false,
    jumpVelocity: 0,
    slideTimer: 0
  });
  
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsArrayRef = useRef<Coin[]>([]);
  const frameCountRef = useRef(0);
  // Fixed: useRef now takes an initial value of undefined to resolve the "Expected 1 arguments, but got 0" error.
  const animationFrameIdRef = useRef<number | undefined>(undefined);

  const spawnObstacle = useCallback(() => {
    const lane = Math.floor(Math.random() * 3) as Lane;
    const types = [ObstacleType.LOG, ObstacleType.FIRE_PIT, ObstacleType.STUMP];
    const type = types[Math.floor(Math.random() * types.length)];
    
    obstaclesRef.current.push({
      id: Date.now() + Math.random(),
      lane,
      type,
      y: -50,
      passed: false
    });
  }, []);

  const spawnCoin = useCallback(() => {
    const lane = Math.floor(Math.random() * 3) as Lane;
    coinsArrayRef.current.push({
      id: Date.now() + Math.random(),
      lane,
      y: -50,
      collected: false
    });
  }, []);

  const update = useCallback(() => {
    if (isPaused) return;

    frameCountRef.current++;
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_INCREMENT);
    scoreRef.current += Math.floor(speedRef.current / 5);

    // Spawn logic
    if (frameCountRef.current % Math.floor(100 / (speedRef.current / 5)) === 0) {
      spawnObstacle();
    }
    if (frameCountRef.current % 40 === 0) {
      spawnCoin();
    }

    // Player Physics
    const p = playerRef.current;
    
    // Smooth lane switching
    const targetX = LANE_CENTERS[p.lane];
    p.visualX += (targetX - p.visualX) * 0.2;

    // Jumping
    if (p.isJumping) {
      p.y += p.jumpVelocity;
      p.jumpVelocity -= GRAVITY;
      if (p.y <= 0) {
        p.y = 0;
        p.isJumping = false;
        p.jumpVelocity = 0;
      }
    }

    // Sliding
    if (p.isSliding) {
      p.slideTimer--;
      if (p.slideTimer <= 0) {
        p.isSliding = false;
      }
    }

    // Obstacles movement and collision
    obstaclesRef.current.forEach(obs => {
      obs.y += speedRef.current;
      
      // Basic bounding box collision
      const playerRect = {
        x: p.visualX - PLAYER_SIZE / 2,
        y: CANVAS_HEIGHT - 100 - p.y - (p.isSliding ? PLAYER_SIZE/2 : PLAYER_SIZE),
        w: PLAYER_SIZE,
        h: p.isSliding ? PLAYER_SIZE / 2 : PLAYER_SIZE
      };

      const obsRect = {
        x: LANE_CENTERS[obs.lane] - OBSTACLE_WIDTH / 2,
        y: obs.y,
        w: OBSTACLE_WIDTH,
        h: OBSTACLE_HEIGHT
      };

      if (
        playerRect.x < obsRect.x + obsRect.w &&
        playerRect.x + playerRect.w > obsRect.x &&
        playerRect.y < obsRect.y + obsRect.h &&
        playerRect.y + playerRect.h > obsRect.y
      ) {
        // Special logic: sliding under logs, jumping over fire
        let hit = true;
        if (obs.type === ObstacleType.LOG && p.isSliding) hit = false;
        if (obs.type === ObstacleType.FIRE_PIT && p.isJumping && p.y > 20) hit = false;
        if (obs.type === ObstacleType.STUMP && p.isJumping && p.y > 20) hit = false;

        if (hit) {
          onGameOver(scoreRef.current, coinsRef.current);
        }
      }
    });

    // Coins collection
    coinsArrayRef.current.forEach(coin => {
      coin.y += speedRef.current;
      const dist = Math.sqrt(
        Math.pow(p.visualX - LANE_CENTERS[coin.lane], 2) +
        Math.pow((CANVAS_HEIGHT - 100 - p.y) - coin.y, 2)
      );
      if (dist < 40 && !coin.collected) {
        coin.collected = true;
        coinsRef.current++;
      }
    });

    // Cleanup
    obstaclesRef.current = obstaclesRef.current.filter(o => o.y < CANVAS_HEIGHT + 100);
    coinsArrayRef.current = coinsArrayRef.current.filter(c => c.y < CANVAS_HEIGHT + 100 && !c.collected);

  }, [isPaused, onGameOver, spawnObstacle, spawnCoin]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background (Path)
    ctx.fillStyle = COLORS.PATH_BROWN;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw lane lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH/3, 0); ctx.lineTo(CANVAS_WIDTH/3, CANVAS_HEIGHT);
    ctx.moveTo(CANVAS_WIDTH*2/3, 0); ctx.lineTo(CANVAS_WIDTH*2/3, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw coins
    coinsArrayRef.current.forEach(coin => {
      ctx.fillStyle = COLORS.ANCIENT_GOLD;
      ctx.beginPath();
      ctx.arc(LANE_CENTERS[coin.lane], coin.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();
    });

    // Draw obstacles
    obstaclesRef.current.forEach(obs => {
      ctx.save();
      const x = LANE_CENTERS[obs.lane] - OBSTACLE_WIDTH / 2;
      if (obs.type === ObstacleType.LOG) {
        ctx.fillStyle = COLORS.LOG;
        ctx.fillRect(x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        // Texture lines
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeRect(x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      } else if (obs.type === ObstacleType.FIRE_PIT) {
        ctx.fillStyle = COLORS.FIRE;
        ctx.beginPath();
        ctx.ellipse(x + OBSTACLE_WIDTH/2, obs.y + OBSTACLE_HEIGHT/2, OBSTACLE_WIDTH/2, OBSTACLE_HEIGHT/2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.FIRE;
        ctx.stroke();
      } else {
        ctx.fillStyle = COLORS.STONE;
        ctx.beginPath();
        ctx.moveTo(x, obs.y + OBSTACLE_HEIGHT);
        ctx.lineTo(x + OBSTACLE_WIDTH/2, obs.y);
        ctx.lineTo(x + OBSTACLE_WIDTH, obs.y + OBSTACLE_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    // Draw "Threat" (Guardian looming at the bottom)
    ctx.save();
    const threatGlow = Math.sin(Date.now() / 200) * 10 + 20;
    ctx.shadowBlur = threatGlow;
    ctx.shadowColor = 'red';
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH * 0.8, CANVAS_HEIGHT - 60);
    ctx.lineTo(CANVAS_WIDTH * 0.2, CANVAS_HEIGHT - 60);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw Player
    const p = playerRef.current;
    ctx.save();
    const playerY = CANVAS_HEIGHT - 100 - p.y;
    ctx.translate(p.visualX, playerY);
    
    // Simple character representation
    if (p.isSliding) {
       ctx.fillStyle = '#3b82f6';
       ctx.fillRect(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE/2);
    } else {
       // Head
       ctx.fillStyle = '#fef3c7';
       ctx.beginPath(); ctx.arc(0, -PLAYER_SIZE - 5, 10, 0, Math.PI*2); ctx.fill();
       // Body
       ctx.fillStyle = '#3b82f6';
       ctx.fillRect(-PLAYER_SIZE/4, -PLAYER_SIZE, PLAYER_SIZE/2, PLAYER_SIZE);
    }
    ctx.restore();

    // HUD Info
    ctx.fillStyle = '#fff';
    ctx.font = '24px Cinzel';
    ctx.fillText(`Distance: ${scoreRef.current}m`, 20, 40);
    ctx.fillStyle = COLORS.ANCIENT_GOLD;
    ctx.fillText(`Coins: ${coinsRef.current}`, 20, 70);

  }, []);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update();
    draw(ctx);
    animationFrameIdRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  useEffect(() => {
    animationFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [loop]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (isPaused) return;

      switch(e.key) {
        case 'ArrowLeft':
          if (p.lane > Lane.LEFT) p.lane--;
          break;
        case 'ArrowRight':
          if (p.lane < Lane.RIGHT) p.lane++;
          break;
        case 'ArrowUp':
        case ' ':
          if (!p.isJumping && !p.isSliding) {
            p.isJumping = true;
            p.jumpVelocity = JUMP_FORCE;
          }
          break;
        case 'ArrowDown':
          if (!p.isJumping && !p.isSliding) {
            p.isSliding = true;
            p.slideTimer = SLIDE_DURATION;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  return (
    <div className="relative border-4 border-amber-900/50 rounded-lg overflow-hidden shadow-2xl">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="bg-stone-900"
      />
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-4xl font-cinzel tracking-widest">PAUSED</span>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
