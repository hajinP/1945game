import React from 'react';
import { Player, GameSettings, StageConfig, Enemy } from '../types/game';
import { Shield, Zap, Flame, Volume2, VolumeX, Pause, Play, Heart } from 'lucide-react';

interface HUDProps {
  player: Player;
  settings: GameSettings;
  stage: StageConfig;
  boss: Enemy | null;
  onTogglePause: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onTriggerBomb: () => void;
  onStartCharge: () => void;
  onReleaseCharge: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  stage,
  boss,
  onTogglePause,
  onToggleMute,
  isMuted,
  onTriggerBomb,
  onStartCharge,
  onReleaseCharge
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none font-mono">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 text-white shadow-xl pointer-events-auto">
        {/* Left: Score & High Score */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">SCORE</div>
            <div className="text-xl md:text-2xl font-black text-amber-300 drop-shadow">
              {player.score.toLocaleString()}
            </div>
          </div>
          <div className="hidden sm:block border-l border-slate-700 pl-4">
            <div className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">STAGE</div>
            <div className="text-sm font-bold text-sky-400">
              {stage.stageNumber} - {stage.title.split(':')[1] || stage.title}
            </div>
          </div>
        </div>

        {/* Center: Boss Health Bar if Boss Active */}
        {boss && boss.isBoss && (
          <div className="flex-1 max-w-xs mx-4">
            <div className="flex justify-between items-center text-[11px] font-bold text-red-400 mb-1">
              <span className="animate-pulse">⚠️ BOSS: {boss.name || stage.bossName}</span>
              <span>{Math.max(0, Math.ceil((boss.hp / boss.maxHp) * 100))}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-red-500/50 shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-100"
                style={{ width: `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={onTogglePause}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Center Combo Pop-up */}
      {player.combo > 1 && (
        <div className="self-center bg-amber-500/20 border border-amber-400/50 backdrop-blur-md px-4 py-1 rounded-full text-amber-300 font-black text-sm tracking-widest animate-bounce shadow-lg">
          🔥 {player.combo}x COMBO!
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        {/* Left Stats: Lives, HP, Power Level */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center gap-4 text-white shadow-xl">
          {/* Player HP */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" /> HP & LIVES
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full transition-all duration-200"
                  style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
                />
              </div>
              <div className="text-xs font-bold text-red-400 flex items-center">
                x{player.lives}
              </div>
            </div>
          </div>

          <div className="border-r border-slate-800 h-8" />

          {/* Power Level */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> POWER LEVEL
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  className={`w-4 h-3 rounded-sm ${
                    lvl <= player.powerLevel
                      ? 'bg-gradient-to-t from-amber-600 to-yellow-300 border border-amber-200 shadow'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-300 ml-1">
                {player.powerLevel === 4 ? 'MAX' : `LV${player.powerLevel}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Touch Controls (Bomb & Charge Buttons for Touch/Mouse users) */}
        <div className="flex items-center gap-3">
          {/* Charge Meter / Hold Button */}
          <div className="flex flex-col items-center">
            <button
              onMouseDown={onStartCharge}
              onMouseUp={onReleaseCharge}
              onTouchStart={onStartCharge}
              onTouchEnd={onReleaseCharge}
              className={`relative px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-lg ${
                player.charge >= 100
                  ? 'bg-amber-500 border-amber-300 text-slate-950 animate-pulse shadow-amber-500/50'
                  : 'bg-slate-900/90 border-slate-700 text-amber-400'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>SUPER CHARGE</span>
              {/* Charge meter fill */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800 rounded-b-xl overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-75"
                  style={{ width: `${player.charge}%` }}
                />
              </div>
            </button>
            <span className="text-[9px] text-slate-400 mt-1 font-sans">KEY: [SPACE] HOLD</span>
          </div>

          {/* Bomb Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={onTriggerBomb}
              disabled={player.bombs <= 0}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                player.bombs > 0
                  ? 'bg-red-600 hover:bg-red-500 border-red-400 text-white shadow-red-600/50'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>BOMB ({player.bombs})</span>
            </button>
            <span className="text-[9px] text-slate-400 mt-1 font-sans">KEY: [B] or [SHIFT]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
