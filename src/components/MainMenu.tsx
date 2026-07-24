import React from 'react';
import { Difficulty, GameSettings } from '../types/game';
import { Play, Trophy, Settings as SettingsIcon, HelpCircle, Volume2, VolumeX, Flame, Zap } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLeaderboard,
  onOpenSettings,
  settings,
  setSettings,
  isMuted,
  onToggleMute
}) => {
  const difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD', 'HELL'];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 font-mono select-none relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ARCADE SYSTEM v1.945</span>
        </div>
        <button
          onClick={onToggleMute}
          className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Center Hero Logo & Buttons */}
      <div className="max-w-xl w-full mx-auto my-auto text-center relative z-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-black text-xs tracking-widest mb-3">
            <Flame className="w-4 h-4 fill-amber-400" /> CLASSIC VERTICAL SHOOTER
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 drop-shadow-2xl">
            STRIKERS 1945
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-2">
            WWII AIR COMBAT ARCADE EDITION
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-2">
            SELECT DIFFICULTY
          </div>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSettings((s) => ({ ...s, difficulty: diff }))}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  settings.difficulty === diff
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onStartGame}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>SORTIE START!</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenLeaderboard}
              className="py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>HIGHSCORES</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-sky-400" />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl text-left text-xs text-slate-300 space-y-1.5 font-sans">
          <div className="font-bold text-amber-400 font-mono text-[11px] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> HOW TO PLAY:
          </div>
          <div>• <strong>MOVE:</strong> Touch Drag / Mouse / Arrow Keys (WASD)</div>
          <div>• <strong>SPECIAL CHARGE:</strong> Hold [SPACE] to charge 100% gauge</div>
          <div>• <strong>SCREEN BOMB:</strong> Press [B] or [SHIFT] to clear all enemy bullets!</div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 relative z-10">
        INSERT COIN TO PLAY • GOOGLE AI STUDIO 1945 EDITION
      </div>
    </div>
  );
};
