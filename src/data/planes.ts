import { PlaneInfo } from '../types/game';

export const PLANES: PlaneInfo[] = [
  {
    id: 'p38',
    name: 'P-38 Lightning',
    code: 'USA - Twin Boom',
    country: 'United States',
    speed: 7,
    power: 8,
    bombPower: 9,
    color: '#3b82f6', // blue
    accentColor: '#fbbf24',
    description: 'Balanced long-range twin-engine fighter. Dual cannons and automatic homing side-missiles.',
    chargeName: 'Mega Plasma Cannon',
    bombName: 'B-29 Carpet Bombing'
  },
  {
    id: 'spitfire',
    name: 'Spitfire Mk.IX',
    code: 'RAF - High Agility',
    country: 'Great Britain',
    speed: 9,
    power: 7,
    bombPower: 8,
    color: '#10b981', // emerald green
    accentColor: '#f59e0b',
    description: 'Ultra-agile interceptor plane. Fires wide multi-directional quad-stream bullets.',
    chargeName: 'Vortex Firestorm',
    bombName: 'Napalm Air Strike'
  },
  {
    id: 'zero',
    name: 'Zero Fighter',
    code: 'IJN - Precision Strike',
    country: 'Japan',
    speed: 8,
    power: 10,
    bombPower: 7,
    color: '#ef4444', // red
    accentColor: '#ffffff',
    description: 'High firepower fighter. Concentrated armor-piercing heavy stream and blade charge.',
    chargeName: 'Kami Blade Beam',
    bombName: 'Divine Wind Shockwave'
  },
  {
    id: 'bf109',
    name: 'Bf 109 Gustav',
    code: 'LUFTWAFFE - Heavy Armor',
    country: 'Germany',
    speed: 6,
    power: 9,
    bombPower: 10,
    color: '#8b5cf6', // purple
    accentColor: '#38bdf8',
    description: 'Heavy armored combat plane with explosive cannon shells and wide laser barrier.',
    chargeName: 'Sonic Pulse Wave',
    bombName: 'Atomic Blast Flare'
  },
  {
    id: 'shinden',
    name: 'J7W Shinden',
    code: 'EXPERIMENTAL - Prototype',
    country: 'Japan Prototype',
    speed: 10,
    power: 9,
    bombPower: 8,
    color: '#f59e0b', // amber / gold
    accentColor: '#06b6d4',
    description: 'Secret prototype with rear propeller. High speed plasma burst and invincibility surge.',
    chargeName: 'Hyper Photon Surge',
    bombName: 'Orbital Ion Cannon'
  }
];
