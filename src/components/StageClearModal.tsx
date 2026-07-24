import React from 'react';
import { Player, StageConfig } from '../types/game';
import { Award, ArrowRight, Trophy, Star } from 'lucide-react';

interface StageClearModalProps {
  player: Player;
  stage: StageConfig;
  onNextStage: () => void;
  isFinalStage: boolean;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  player,
  stage,
  onNextStage,
  isFinalStage
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase">
            <Award className="w-4 h-4 text-amber-400" /> MISSION ACCOMPLISHED!
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
            {isFinalStage ? 'VICTORY!' : 'STAGE CLEAR!'}
          </h2>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 text-amber-400">
          <Star className="w-8 h-8 fill-amber-400 animate-bounce" />
          <Star className="w-10 h-10 fill-amber-300 animate-bounce delay-100" />
          <Star className="w-8 h-8 fill-amber-400 animate-bounce delay-200" />
        </div>

        {/* Breakdown */}
        <div className="bg-slate-950 p-4 rounded-xl space-y-2 text-xs text-slate-300 font-sans border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">STAGE CLEARED:</span>
            <span className="font-bold text-white font-mono">{stage.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">TOTAL SCORE:</span>
            <span className="font-bold text-amber-300 font-mono text-base">{player.score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">REMAINING LIVES BONUS:</span>
            <span className="font-bold text-emerald-400 font-mono">+{player.lives * 1000}</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onNextStage}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <span>{isFinalStage ? 'HALL OF FAME LEADERBOARD' : 'PROCEED TO NEXT MISSION'}</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
