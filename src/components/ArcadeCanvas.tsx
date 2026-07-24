import React, { useRef, useEffect, useCallback } from 'react';
import {
  Player,
  Bullet,
  Enemy,
  PowerUp,
  PowerUpType,
  Particle,
  FloatingText,
  BombEffect,
  GameSettings,
  StageConfig,
  PlaneId
} from '../types/game';
import { soundManager } from '../utils/audio';
import { drawPlayerPlane, drawEnemy, drawPowerUp } from '../utils/sprites';

interface ArcadeCanvasProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  settings: GameSettings;
  stage: StageConfig;
  boss: Enemy | null;
  setBoss: React.Dispatch<React.SetStateAction<Enemy | null>>;
  onStageClear: () => void;
  onGameOver: () => void;
  isPaused: boolean;
  isBombActive: boolean;
  setIsBombActive: (active: boolean) => void;
}

export const ArcadeCanvas: React.FC<ArcadeCanvasProps> = ({
  player,
  setPlayer,
  settings,
  stage,
  boss,
  setBoss,
  onStageClear,
  onGameOver,
  isPaused,
  isBombActive,
  setIsBombActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable Game Entities in Ref to avoid React state re-render lag during 60FPS loop
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);

  // Timers & State
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchPosRef = useRef<{ x: number; y: number } | null>(null);
  const isChargingRef = useRef<boolean>(false);
  const stageTimerRef = useRef<number>(0);
  const bossSpawnedRef = useRef<boolean>(false);
  const animTickRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const bombProgressRef = useRef<number>(0);

  // Key Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;

      // Bomb hotkey
      if ((e.code === 'KeyB' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.repeat) {
        triggerBomb();
      }

      // Space hold for charge shot
      if (e.code === 'Space' && !e.repeat) {
        isChargingRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;

      if (e.code === 'Space') {
        if (isChargingRef.current && player.charge >= 100) {
          fireChargeShot();
        }
        isChargingRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player]);

  // Touch & Pointer Listeners
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    touchPosRef.current = { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!touchPosRef.current || settings.controlMode === 'KEYBOARD') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Smooth movement towards cursor / touch drag
    setPlayer((prev) => ({
      ...prev,
      x: Math.max(30, Math.min(canvas.width - 30, x)),
      y: Math.max(40, Math.min(canvas.height - 40, y))
    }));
    touchPosRef.current = { x, y };
  };

  const handlePointerUp = () => {
    touchPosRef.current = null;
  };

  // Bomb Trigger
  const triggerBomb = useCallback(() => {
    if (player.bombs <= 0 || isBombActive) return;

    soundManager.playBomb();
    setIsBombActive(true);
    bombProgressRef.current = 0;
    screenShakeRef.current = 25;

    // Clear all enemy bullets on screen!
    bulletsRef.current = bulletsRef.current.filter((b) => b.owner === 'PLAYER');

    // Damage all enemies on screen
    enemiesRef.current.forEach((enemy) => {
      enemy.hp -= 200;
      createExplosion(enemy.x, enemy.y, '#f59e0b', 12);
    });

    if (boss) {
      setBoss((prev) => (prev ? { ...prev, hp: prev.hp - 300 } : null));
    }

    setPlayer((prev) => ({
      ...prev,
      bombs: Math.max(0, prev.bombs - 1)
    }));
  }, [player.bombs, isBombActive, boss, setBoss, setIsBombActive]);

  // Charge Shot Execution
  const fireChargeShot = useCallback(() => {
    soundManager.playChargeShot();
    const planeId = player.planeId;

    // Spawn massive laser beam / super bullet
    const chargeBullet: Bullet = {
      id: Math.random().toString(),
      x: player.x,
      y: player.y - 30,
      vx: 0,
      vy: -18,
      radius: 28,
      damage: 180,
      owner: 'PLAYER',
      type: 'CHARGE_SHOT',
      color: planeId === 'p38' ? '#38bdf8' : planeId === 'spitfire' ? '#10b981' : planeId === 'zero' ? '#ef4444' : '#f59e0b',
      glow: true
    };

    bulletsRef.current.push(chargeBullet);
    setPlayer((prev) => ({ ...prev, charge: 0 }));
  }, [player]);

  // Create Particles
  const createExplosion = (x: number, y: number, color: string = '#f59e0b', count: number = 15) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      particlesRef.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 25 + 15,
        shape: Math.random() > 0.5 ? 'SPARK' : 'SMOKE'
      });
    }
  };

  const createFloatingText = (text: string, x: number, y: number, color: string = '#fbbf24') => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -1.5
    });
  };

  // MAIN GAME LOOP (60 FPS)
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 800;

    const render = () => {
      if (isPaused) return;

      animTickRef.current++;
      stageTimerRef.current += 1 / 60;
      const tick = animTickRef.current;

      // 1. UPDATE PLAYER POSITION (Keyboard controls)
      if (settings.controlMode === 'KEYBOARD') {
        let dx = 0;
        let dy = 0;
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) dx -= player.speed;
        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) dx += player.speed;
        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) dy -= player.speed;
        if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) dy += player.speed;

        if (dx !== 0 || dy !== 0) {
          setPlayer((prev) => ({
            ...prev,
            x: Math.max(30, Math.min(canvas.width - 30, prev.x + dx)),
            y: Math.max(40, Math.min(canvas.height - 40, prev.y + dy))
          }));
        }
      }

      // 2. PLAYER AUTO-FIRING & CHARGE GAUGE
      if (tick % 6 === 0) {
        soundManager.playPlayerShoot(player.planeId);

        // Weapon Spread based on power level
        const pLvl = player.powerLevel;
        const pId = player.planeId;

        if (pLvl === 1) {
          bulletsRef.current.push({
            id: Math.random().toString(),
            x: player.x,
            y: player.y - 20,
            vx: 0,
            vy: -14,
            radius: 5,
            damage: 15,
            owner: 'PLAYER',
            type: 'NORMAL',
            color: '#fbbf24'
          });
        } else if (pLvl === 2) {
          bulletsRef.current.push(
            { id: Math.random().toString(), x: player.x - 10, y: player.y - 18, vx: 0, vy: -15, radius: 5, damage: 14, owner: 'PLAYER', type: 'NORMAL', color: '#fbbf24' },
            { id: Math.random().toString(), x: player.x + 10, y: player.y - 18, vx: 0, vy: -15, radius: 5, damage: 14, owner: 'PLAYER', type: 'NORMAL', color: '#fbbf24' }
          );
        } else if (pLvl === 3) {
          bulletsRef.current.push(
            { id: Math.random().toString(), x: player.x - 14, y: player.y - 18, vx: -2, vy: -14, radius: 5, damage: 14, owner: 'PLAYER', type: 'NORMAL', color: '#38bdf8' },
            { id: Math.random().toString(), x: player.x, y: player.y - 20, vx: 0, vy: -15, radius: 6, damage: 18, owner: 'PLAYER', type: 'NORMAL', color: '#fbbf24' },
            { id: Math.random().toString(), x: player.x + 14, y: player.y - 18, vx: 2, vy: -14, radius: 5, damage: 14, owner: 'PLAYER', type: 'NORMAL', color: '#38bdf8' }
          );
        } else {
          // MAX POWER LEVEL 4
          bulletsRef.current.push(
            { id: Math.random().toString(), x: player.x - 20, y: player.y - 15, vx: -4, vy: -14, radius: 5, damage: 14, owner: 'PLAYER', type: 'SPREAD', color: '#ef4444' },
            { id: Math.random().toString(), x: player.x - 8, y: player.y - 20, vx: -1, vy: -16, radius: 6, damage: 16, owner: 'PLAYER', type: 'NORMAL', color: '#fbbf24' },
            { id: Math.random().toString(), x: player.x + 8, y: player.y - 20, vx: 1, vy: -16, radius: 6, damage: 16, owner: 'PLAYER', type: 'NORMAL', color: '#fbbf24' },
            { id: Math.random().toString(), x: player.x + 20, y: player.y - 15, vx: 4, vy: -14, radius: 5, damage: 14, owner: 'PLAYER', type: 'SPREAD', color: '#ef4444' }
          );
        }
      }

      // Accumulate charge if charging button held
      if (isChargingRef.current && player.charge < 100) {
        setPlayer((prev) => ({ ...prev, charge: Math.min(100, prev.charge + 1.2) }));
      }

      // Combo Decay
      if (player.comboTimer > 0) {
        setPlayer((prev) => {
          const nextTimer = prev.comboTimer - 1;
          return {
            ...prev,
            comboTimer: nextTimer,
            combo: nextTimer <= 0 ? 0 : prev.combo
          };
        });
      }

      // 3. SPAWN ENEMIES IN WAVES
      if (!bossSpawnedRef.current && stageTimerRef.current < stage.duration) {
        if (tick % 75 === 0) {
          const spawnX = Math.random() * (canvas.width - 100) + 50;
          const types: ('RECON' | 'FIGHTER' | 'BOMBER')[] = ['RECON', 'FIGHTER', 'BOMBER'];
          const chosenType = types[Math.floor(Math.random() * types.length)];

          enemiesRef.current.push({
            id: Math.random().toString(),
            type: chosenType,
            x: spawnX,
            y: -40,
            vx: (Math.random() - 0.5) * 2,
            vy: chosenType === 'RECON' ? 3.5 : 2,
            width: chosenType === 'BOMBER' ? 60 : 42,
            height: chosenType === 'BOMBER' ? 50 : 38,
            hp: chosenType === 'BOMBER' ? 80 : 30,
            maxHp: chosenType === 'BOMBER' ? 80 : 30,
            scoreValue: chosenType === 'BOMBER' ? 500 : 150,
            color: chosenType === 'BOMBER' ? '#0284c7' : '#e11d48',
            shootCooldown: 0,
            shootInterval: chosenType === 'BOMBER' ? 60 : 90,
            pattern: 'STRAIGHT',
            patternTimer: 0
          });
        }
      }

      // SPAWN BOSS WHEN TIMER REACHES DURATION
      if (!bossSpawnedRef.current && stageTimerRef.current >= stage.duration) {
        bossSpawnedRef.current = true;
        soundManager.playBossWarning();

        const bossEntity: Enemy = {
          id: 'boss_' + stage.stageNumber,
          type: 'BOSS',
          name: stage.bossName,
          x: canvas.width / 2,
          y: -100,
          vx: 0,
          vy: 1,
          width: 180,
          height: 120,
          hp: stage.bossHp,
          maxHp: stage.bossHp,
          scoreValue: 5000,
          color: '#ef4444',
          shootCooldown: 0,
          shootInterval: 40,
          pattern: 'BOSS_PATTERNS',
          patternTimer: 0,
          isBoss: true,
          bossPhase: 1
        };

        setBoss(bossEntity);
      }

      // UPDATE BOSS ENTITY & ATTACK PATTERNS
      if (boss) {
        // Move boss into top arena position
        let newX = boss.x;
        let newY = boss.y;

        if (boss.y < 130) {
          newY += 1.5;
        } else {
          // Boss hovering sine motion
          newX = canvas.width / 2 + Math.sin(tick * 0.03) * 160;
        }

        // Boss Shoot bullets
        if (tick % boss.shootInterval === 0 && boss.y >= 100) {
          soundManager.playEnemyShoot();
          // Radial bullet hell ring
          const bulletCount = 12;
          for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i + tick * 0.05;
            bulletsRef.current.push({
              id: Math.random().toString(),
              x: newX,
              y: newY + 20,
              vx: Math.cos(angle) * 4,
              vy: Math.sin(angle) * 4,
              radius: 6,
              damage: 20,
              owner: 'ENEMY',
              type: 'BOSS_SPECIAL',
              color: '#ef4444',
              glow: true
            });
          }
        }

        setBoss((prev) => (prev ? { ...prev, x: newX, y: newY } : null));

        // Check Boss Defeat
        if (boss.hp <= 0) {
          soundManager.playExplosion(true);
          createExplosion(boss.x, boss.y, '#ef4444', 60);
          screenShakeRef.current = 30;

          // Score bonus
          setPlayer((prev) => ({ ...prev, score: prev.score + boss.scoreValue }));
          setBoss(null);

          setTimeout(() => {
            onStageClear();
          }, 1500);
        }
      }

      // 4. UPDATE ENEMIES
      enemiesRef.current.forEach((enemy) => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Enemy shooting
        enemy.shootCooldown++;
        if (enemy.shootCooldown >= enemy.shootInterval && enemy.y > 0 && enemy.y < canvas.height - 100) {
          enemy.shootCooldown = 0;
          soundManager.playEnemyShoot();

          // Targeted bullet towards player
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          bulletsRef.current.push({
            id: Math.random().toString(),
            x: enemy.x,
            y: enemy.y + 15,
            vx: (dx / dist) * 4,
            vy: (dy / dist) * 4,
            radius: 5,
            damage: 15,
            owner: 'ENEMY',
            type: 'NORMAL',
            color: '#f97316'
          });
        }
      });

      // Filter off-screen enemies
      enemiesRef.current = enemiesRef.current.filter((e) => e.y < canvas.height + 60 && e.hp > 0);

      // 5. UPDATE BULLETS & COLLISIONS
      bulletsRef.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
      });

      // Bullet Off-screen filter
      bulletsRef.current = bulletsRef.current.filter(
        (b) => b.x >= -20 && b.x <= canvas.width + 20 && b.y >= -20 && b.y <= canvas.height + 20
      );

      // COLLISION: Player Bullets vs Enemies
      bulletsRef.current
        .filter((b) => b.owner === 'PLAYER')
        .forEach((bullet) => {
          // Check Boss hit
          if (boss && Math.hypot(bullet.x - boss.x, bullet.y - boss.y) < boss.width / 2 + bullet.radius) {
            boss.hp -= bullet.damage;
            createExplosion(bullet.x, bullet.y, '#38bdf8', 4);
            bullet.y = -999; // destroy bullet
          }

          // Check normal enemies hit
          enemiesRef.current.forEach((enemy) => {
            if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < enemy.width / 2 + bullet.radius) {
              enemy.hp -= bullet.damage;
              createExplosion(bullet.x, bullet.y, bullet.color, 5);
              bullet.y = -999; // destroy bullet

              if (enemy.hp <= 0) {
                soundManager.playExplosion(false);
                createExplosion(enemy.x, enemy.y, enemy.color, 15);

                // Score + Combo
                setPlayer((prev) => ({
                  ...prev,
                  score: prev.score + enemy.scoreValue * Math.max(1, prev.combo),
                  combo: prev.combo + 1,
                  comboTimer: 180
                }));

                createFloatingText(`+${enemy.scoreValue}`, enemy.x, enemy.y);

                // Chance to drop power-up
                if (Math.random() < 0.35) {
                  const items: PowerUpType[] = ['POWER', 'BOMB', 'MEDAL', 'HEALTH'];
                  const picked = items[Math.floor(Math.random() * items.length)];

                  powerUpsRef.current.push({
                    id: Math.random().toString(),
                    type: picked,
                    x: enemy.x,
                    y: enemy.y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: 1.8,
                    radius: 12,
                    value: picked === 'MEDAL' ? 500 : 1
                  });
                }
              }
            }
          });
        });

      // COLLISION: Enemy Bullets vs Player
      if (!player.isInvincible) {
        bulletsRef.current
          .filter((b) => b.owner === 'ENEMY')
          .forEach((bullet) => {
            if (Math.hypot(bullet.x - player.x, bullet.y - player.y) < 12) {
              soundManager.playExplosion(true);
              createExplosion(player.x, player.y, '#ef4444', 20);
              bullet.y = 9999; // destroy bullet
              screenShakeRef.current = 15;

              setPlayer((prev) => {
                const nextHp = prev.hp - bullet.damage;
                if (nextHp <= 0) {
                  const nextLives = prev.lives - 1;
                  if (nextLives <= 0) {
                    onGameOver();
                  }
                  return {
                    ...prev,
                    hp: prev.maxHp,
                    lives: nextLives,
                    powerLevel: Math.max(1, prev.powerLevel - 1),
                    isInvincible: true,
                    invincibleTimer: 120
                  };
                }
                return {
                  ...prev,
                  hp: nextHp,
                  isInvincible: true,
                  invincibleTimer: 60
                };
              });
            }
          });
      }

      // Handle Player Invincibility timer
      if (player.isInvincible) {
        setPlayer((prev) => {
          const nextTimer = prev.invincibleTimer - 1;
          return {
            ...prev,
            invincibleTimer: nextTimer,
            isInvincible: nextTimer > 0
          };
        });
      }

      // 6. UPDATE & COLLECT POWERUPS
      powerUpsRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Pickup collision with player
        if (Math.hypot(p.x - player.x, p.y - player.y) < p.radius + 20) {
          p.y = 9999; // collected

          if (p.type === 'POWER') {
            soundManager.playPowerUp();
            setPlayer((prev) => ({ ...prev, powerLevel: Math.min(4, prev.powerLevel + 1) }));
            createFloatingText('POWER UP!', player.x, player.y - 20, '#eab308');
          } else if (p.type === 'BOMB') {
            soundManager.playPowerUp();
            setPlayer((prev) => ({ ...prev, bombs: prev.bombs + 1 }));
            createFloatingText('+1 BOMB!', player.x, player.y - 20, '#ef4444');
          } else if (p.type === 'MEDAL') {
            soundManager.playMedal();
            setPlayer((prev) => ({ ...prev, score: prev.score + 500 }));
            createFloatingText('+500', player.x, player.y - 20, '#38bdf8');
          } else if (p.type === 'HEALTH') {
            soundManager.playPowerUp();
            setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 30) }));
            createFloatingText('REPAIRED!', player.x, player.y - 20, '#22c55e');
          }
        }
      });
      powerUpsRef.current = powerUpsRef.current.filter((p) => p.y < canvas.height + 30);

      // 7. PARTICLES & FLOATING TEXTS
      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.life < pt.maxLife);

      floatingTextsRef.current.forEach((ft) => {
        ft.y += ft.vy;
        ft.alpha -= 0.02;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.alpha > 0);

      // --- RENDERING CANVAS SCENE ---
      ctx.save();

      // Screen Shake
      if (screenShakeRef.current > 0) {
        ctx.translate((Math.random() - 0.5) * screenShakeRef.current, (Math.random() - 0.5) * screenShakeRef.current);
        screenShakeRef.current *= 0.9;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // Background Gradient (Ocean / Islands / Cloud Fortress)
      const bgOffset = (tick * 2) % canvas.height;
      if (stage.bgType === 'OCEAN') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Water Wave Ripples
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 2;
        for (let y = -canvas.height; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y + bgOffset);
          ctx.lineTo(canvas.width, y + bgOffset);
          ctx.stroke();
        }
      } else if (stage.bgType === 'ISLANDS') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Island shapes scrolling
        ctx.fillStyle = '#14532d'; // Dark tropical island green
        ctx.beginPath();
        ctx.ellipse(120, (bgOffset * 1.2) % (canvas.height + 200) - 100, 80, 140, 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Floating Cloud Layer with drop shadows
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      const cloudY = (tick * 1.5) % (canvas.height + 300) - 150;
      ctx.beginPath();
      ctx.ellipse(200, cloudY, 120, 60, 0, 0, Math.PI * 2);
      ctx.ellipse(320, cloudY + 30, 90, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // DRAW ENEMIES
      enemiesRef.current.forEach((enemy) => {
        drawEnemy(ctx, enemy, tick);
      });

      // DRAW BOSS IF PRESENT
      if (boss) {
        drawEnemy(ctx, boss, tick);
      }

      // DRAW BULLETS
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.color;

        if (b.type === 'CHARGE_SHOT') {
          // Massive energy beam
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, b.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // DRAW POWER UPS
      powerUpsRef.current.forEach((p) => {
        drawPowerUp(ctx, p.type, p.x, p.y, p.radius, tick);
      });

      // DRAW PLAYER
      drawPlayerPlane(
        ctx,
        player.planeId,
        player.x,
        player.y,
        player.width,
        player.height,
        tick,
        player.isInvincible
      );

      // BOMB EFFECT OVERLAY
      if (isBombActive) {
        bombProgressRef.current += 0.02;
        if (bombProgressRef.current >= 1) {
          setIsBombActive(false);
        } else {
          const prog = bombProgressRef.current;
          // Whiteout shockwave flash
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(prog * Math.PI) * 0.8})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // B-29 Flying Fleet visual
          const planeY = canvas.height - prog * (canvas.height + 200);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, planeY);
          ctx.lineTo(canvas.width / 2 - 80, planeY + 100);
          ctx.lineTo(canvas.width / 2 + 80, planeY + 100);
          ctx.closePath();
          ctx.fill();
        }
      }

      // DRAW PARTICLES
      particlesRef.current.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // DRAW FLOATING TEXTS
      floatingTextsRef.current.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPaused,
    player,
    setPlayer,
    settings,
    stage,
    boss,
    setBoss,
    onStageClear,
    onGameOver,
    isBombActive,
    setIsBombActive
  ]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full max-w-[600px] h-auto aspect-[3/4] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl cursor-crosshair touch-none"
      />
    </div>
  );
};
