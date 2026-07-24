import React, { useState, useEffect } from 'react';
import {
  GameState,
  Player,
  GameSettings,
  StageConfig,
  Enemy,
  PlaneId,
  HighScoreRecord
} from './types/game';
import { PLANES } from './data/planes';
import { STAGES } from './data/stages';
import { soundManager } from './utils/audio';

import { MainMenu } from './components/MainMenu';
import { PlaneSelection } from './components/PlaneSelection';
import { ArcadeCanvas } from './components/ArcadeCanvas';
import { HUD } from './components/HUD';
import { GameOverModal } from './components/GameOverModal';
import { StageClearModal } from './components/StageClearModal';
import { Leaderboard } from './components/Leaderboard';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [selectedPlaneId, setSelectedPlaneId] = useState<PlaneId>('p38');
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBombActive, setIsBombActive] = useState<boolean>(false);

  // Modals & Panels
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [newScoreRecord, setNewScoreRecord] = useState<HighScoreRecord | null>(null);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    sfxVolume: 80,
    bgmVolume: 40,
    difficulty: 'NORMAL',
    autoFire: true,
    controlMode: 'KEYBOARD',
    showHitbox: false
  });

  // Player State
  const [player, setPlayer] = useState<Player>({
    x: 300,
    y: 650,
    width: 50,
    height: 50,
    speed: 7,
    hp: 100,
    maxHp: 100,
    lives: 3,
    bombs: 3,
    powerLevel: 1,
    planeId: 'p38',
    isInvincible: false,
    invincibleTimer: 0,
    charge: 0,
    isCharging: false,
    score: 0,
    combo: 0,
    comboTimer: 0
  });

  // Boss state
  const [boss, setBoss] = useState<Enemy | null>(null);

  // Synchronize Sound Manager Settings
  useEffect(() => {
    soundManager.setSfxVolume(settings.sfxVolume);
    soundManager.setBgmVolume(settings.bgmVolume);
  }, [settings.sfxVolume, settings.bgmVolume]);

  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Manage BGM state based on GameState
  useEffect(() => {
    if (gameState === 'PLAYING') {
      soundManager.startBGM();
    } else {
      soundManager.stopBGM();
    }
  }, [gameState]);

  const currentStage: StageConfig = STAGES[currentStageIdx] || STAGES[0];

  // Start new game run
  const handleStartGameRun = (planeId: PlaneId) => {
    const selectedPlane = PLANES.find((p) => p.id === planeId) || PLANES[0];
    setSelectedPlaneId(planeId);

    // Initial player stats
    setPlayer({
      x: 300,
      y: 650,
      width: 52,
      height: 52,
      speed: selectedPlane.speed,
      hp: 100,
      maxHp: 100,
      lives: settings.difficulty === 'EASY' ? 5 : settings.difficulty === 'HELL' ? 1 : 3,
      bombs: 3,
      powerLevel: 1,
      planeId: planeId,
      isInvincible: true,
      invincibleTimer: 60,
      charge: 0,
      isCharging: false,
      score: 0,
      combo: 0,
      comboTimer: 0
    });

    setCurrentStageIdx(0);
    setBoss(null);
    setGameState('PLAYING');
  };

  // Next Stage Proceed
  const handleNextStage = () => {
    if (currentStageIdx + 1 < STAGES.length) {
      setCurrentStageIdx((prev) => prev + 1);
      setBoss(null);
      // Give small stage bonus HP & bomb
      setPlayer((prev) => ({
        ...prev,
        hp: prev.maxHp,
        bombs: Math.min(5, prev.bombs + 1),
        isInvincible: true,
        invincibleTimer: 60
      }));
      setGameState('PLAYING');
    } else {
      // VICTORY!
      const record: HighScoreRecord = {
        id: Math.random().toString(),
        name: 'ACE PILOT',
        score: player.score,
        stage: 4,
        planeId: player.planeId,
        difficulty: settings.difficulty,
        date: new Date().toISOString().split('T')[0]
      };
      setNewScoreRecord(record);
      setGameState('VICTORY');
      setShowLeaderboard(true);
    }
  };

  // Game Over Trigger
  const handleGameOver = () => {
    const record: HighScoreRecord = {
      id: Math.random().toString(),
      name: 'ACE PILOT',
      score: player.score,
      stage: currentStageIdx + 1,
      planeId: player.planeId,
      difficulty: settings.difficulty,
      date: new Date().toISOString().split('T')[0]
    };
    setNewScoreRecord(record);
    setGameState('GAMEOVER');
  };

  // Retry stage
  const handleRetry = () => {
    setPlayer((prev) => ({
      ...prev,
      hp: prev.maxHp,
      lives: 3,
      bombs: 3,
      powerLevel: 1,
      isInvincible: true,
      invincibleTimer: 60
    }));
    setBoss(null);
    setGameState('PLAYING');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono select-none overflow-x-hidden">
      {/* 1. MAIN MENU */}
      {gameState === 'MENU' && !showLeaderboard && (
        <MainMenu
          onStartGame={() => setGameState('SELECT')}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenSettings={() => setShowSettings(true)}
          settings={settings}
          setSettings={setSettings}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      )}

      {/* 2. PLANE SELECTION */}
      {gameState === 'SELECT' && (
        <PlaneSelection
          onSelectPlane={handleStartGameRun}
          onBack={() => setGameState('MENU')}
        />
      )}

      {/* 3. ACTIVE PLAYING CANVAS */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="relative w-full h-screen flex items-center justify-center bg-slate-950 p-2 sm:p-4">
          <ArcadeCanvas
            player={player}
            setPlayer={setPlayer}
            settings={settings}
            stage={currentStage}
            boss={boss}
            setBoss={setBoss}
            onStageClear={() => setGameState('STAGECLEAR')}
            onGameOver={handleGameOver}
            isPaused={gameState === 'PAUSED'}
            isBombActive={isBombActive}
            setIsBombActive={setIsBombActive}
          />

          <HUD
            player={player}
            settings={settings}
            stage={currentStage}
            boss={boss}
            onTogglePause={() => setGameState((s) => (s === 'PLAYING' ? 'PAUSED' : 'PLAYING'))}
            onToggleMute={() => setIsMuted(!isMuted)}
            isMuted={isMuted}
            onTriggerBomb={() => setIsBombActive(true)}
            onStartCharge={() => setPlayer((p) => ({ ...p, isCharging: true }))}
            onReleaseCharge={() => setPlayer((p) => ({ ...p, isCharging: false }))}
          />
        </div>
      )}

      {/* 4. MODALS & OVERLAYS */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          player={player}
          stage={currentStage}
          onRetry={handleRetry}
          onMenu={() => setGameState('MENU')}
        />
      )}

      {gameState === 'STAGECLEAR' && (
        <StageClearModal
          player={player}
          stage={currentStage}
          onNextStage={handleNextStage}
          isFinalStage={currentStageIdx >= STAGES.length - 1}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onBack={() => {
            setShowLeaderboard(false);
            if (gameState === 'VICTORY') setGameState('MENU');
          }}
          newScoreRecord={newScoreRecord}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
