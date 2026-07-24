import { StageConfig } from '../types/game';

export const STAGES: StageConfig[] = [
  {
    stageNumber: 1,
    title: 'Stage 1: Operation Pacific Dawn',
    location: 'Midway Atoll Archipelago',
    bgType: 'OCEAN',
    bossName: 'Goliath Flying Fortress',
    bossType: 'Super Heavy Bomber',
    bossHp: 800,
    duration: 35
  },
  {
    stageNumber: 2,
    title: 'Stage 2: Island Base Invasion',
    location: 'Volcanic Island Outpost',
    bgType: 'ISLANDS',
    bossName: 'Iron Dreadnought Yamato',
    bossType: 'Super Heavy Battleship',
    bossHp: 1300,
    duration: 40
  },
  {
    stageNumber: 3,
    title: 'Stage 3: Cloud Fortress Assault',
    location: 'Alpine Mountain Ridge',
    bgType: 'MOUNTAIN',
    bossName: 'Aegis Zeppelin Citadel',
    bossType: 'Airborne Command Platform',
    bossHp: 1900,
    duration: 45
  },
  {
    stageNumber: 4,
    title: 'Stage 4: Final Enemy HQ Airfield',
    location: 'Black Forest Enemy Citadel',
    bgType: 'BASE',
    bossName: 'V-3 Valkyrie Prototype',
    bossType: 'Supersonic Jet Super Boss',
    bossHp: 2600,
    duration: 50
  }
];
