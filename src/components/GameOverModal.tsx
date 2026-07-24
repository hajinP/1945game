import React, { useState, useEffect } from 'react';
import { Player, StageConfig } from '../types/game';
import { RefreshCw, Home, Flame, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  player: Player;
  stage: StageConfig;
  onRetry: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  player,
  stage,
  onRetry,
  onMenu
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase">
            <AlertTriangle className="w-3.5 h-3.5" /> MISSION FAILED
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight">
            GAME OVER
          </h2>
        </div>

        {/* Arcade Continue Countdown */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            INSERT COIN / CONTINUE?
          </div>
          <div className="text-5xl font-black text-amber-400 animate-pulse">
            {countdown}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-300 font-sans">
          <div className="flex justify-between">
            <span className="text-slate-400">FINAL SCORE:</span>
            <span className="font-bold text-amber-300 font-mono text-sm">{player.score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">STAGE REACHED:</span>
            <span className="font-bold text-sky-400 font-mono">Stage {stage.stageNumber}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>CONTINUE (RETRY MISSION)</span>
          </button>
          <button
            onClick={onMenu}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO HANGAR MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
