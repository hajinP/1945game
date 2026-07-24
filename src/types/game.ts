export type GameState = 'MENU' | 'SELECT' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'STAGECLEAR' | 'VICTORY';

export type PlaneId = 'p38' | 'spitfire' | 'zero' | 'bf109' | 'shinden';

export interface PlaneInfo {
  id: PlaneId;
  name: string;
  code: string;
  country: string;
  speed: number; // 1-10
  power: number; // 1-10
  bombPower: number; // 1-10
  color: string;
  accentColor: string;
  description: string;
  chargeName: string;
  bombName: string;
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'HELL';

export interface GameSettings {
  sfxVolume: number; // 0 - 100
  bgmVolume: number; // 0 - 100
  difficulty: Difficulty;
  autoFire: boolean;
  controlMode: 'KEYBOARD' | 'MOUSE' | 'TOUCH';
  showHitbox: boolean;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  lives: number;
  bombs: number;
  powerLevel: number; // 1 to 4
  planeId: PlaneId;
  isInvincible: boolean;
  invincibleTimer: number;
  charge: number; // 0 to 100
  isCharging: boolean;
  score: number;
  combo: number;
  comboTimer: number;
}

export type BulletOwner = 'PLAYER' | 'ENEMY';
export type BulletType = 'NORMAL' | 'LASER' | 'HOMING' | 'SPREAD' | 'PLASMA' | 'CHARGE_SHOT' | 'BOSS_SPECIAL';

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  owner: BulletOwner;
  type: BulletType;
  color: string;
  glow?: boolean;
}

export type EnemyType = 'RECON' | 'FIGHTER' | 'BOMBER' | 'GUNSHIP' | 'BOSS';

export interface Enemy {
  id: string;
  type: EnemyType;
  name?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  scoreValue: number;
  color: string;
  shootCooldown: number;
  shootInterval: number;
  pattern: 'STRAIGHT' | 'SINE' | 'SWOOP' | 'BOSS_PATTERNS';
  patternTimer: number;
  isBoss?: boolean;
  bossPhase?: number;
}

export type PowerUpType = 'POWER' | 'BOMB' | 'MEDAL' | 'HEALTH';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  value: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'CIRCLE' | 'SPARK' | 'SMOKE' | 'SHOCKWAVE';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
}

export interface BombEffect {
  active: boolean;
  planeId: PlaneId;
  progress: number; // 0 to 1
  duration: number; // frames
}

export interface StageConfig {
  stageNumber: number;
  title: string;
  location: string;
  bgType: 'OCEAN' | 'ISLANDS' | 'MOUNTAIN' | 'BASE';
  bossName: string;
  bossType: string;
  bossHp: number;
  duration: number; // in seconds before boss spawns
}

export interface HighScoreRecord {
  id: string;
  name: string;
  score: number;
  stage: number;
  planeId: PlaneId;
  difficulty: Difficulty;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}
