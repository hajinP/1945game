import React, { useState, useEffect } from 'react';
import { HighScoreRecord } from '../types/game';
import { Trophy, Medal, ArrowLeft, Trash2 } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
  newScoreRecord?: HighScoreRecord | null;
}

const DEFAULT_SCORES: HighScoreRecord[] = [
  { id: '1', name: 'ACE PILOT', score: 128500, stage: 4, planeId: 'p38', difficulty: 'HARD', date: '2026-07-20' },
  { id: '2', name: 'RED BARON', score: 96400, stage: 3, planeId: 'bf109', difficulty: 'NORMAL', date: '2026-07-21' },
  { id: '3', name: 'VIPER 1', score: 74200, stage: 3, planeId: 'spitfire', difficulty: 'NORMAL', date: '2026-07-22' },
  { id: '4', name: 'ZERO ACE', score: 58900, stage: 2, planeId: 'zero', difficulty: 'EASY', date: '2026-07-23' },
  { id: '5', name: 'ROOKIE', score: 32100, stage: 1, planeId: 'shinden', difficulty: 'EASY', date: '2026-07-23' }
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack, newScoreRecord }) => {
  const [scores, setScores] = useState<HighScoreRecord[]>(() => {
    const saved = localStorage.getItem('1945_high_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SCORES;
      }
    }
    return DEFAULT_SCORES;
  });

  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('1945_high_scores', JSON.stringify(scores));
  }, [scores]);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScoreRecord || !playerName.trim()) return;

    const record: HighScoreRecord = {
      ...newScoreRecord,
      name: playerName.trim().toUpperCase().slice(0, 10)
    };

    const updated = [...scores, record].sort((a, b) => b.score - a.score).slice(0, 10);
    setScores(updated);
    setSubmitted(true);
  };

  const handleClear = () => {
    if (confirm('Clear all local high score records?')) {
      setScores(DEFAULT_SCORES);
      localStorage.removeItem('1945_high_scores');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-8 font-mono select-none flex flex-col justify-between">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-black text-amber-400">HALL OF FAME</h1>
              <p className="text-xs text-slate-400">TOP 10 PILOTS LEADERBOARD</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
        </div>

        {/* Input Name if New Highscore Record */}
        {newScoreRecord && !submitted && (
          <form onSubmit={handleSaveScore} className="bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-amber-300">
              🎉 NEW HIGH SCORE DETECTED: {newScoreRecord.score.toLocaleString()} PTS!
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ENTER CALLSIGN (e.g. MAVERICK)"
                maxLength={10}
                className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-amber-300 font-bold text-sm uppercase focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-400 transition-colors"
              >
                SAVE RECORD
              </button>
            </div>
          </form>
        )}

        {/* Score Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-widest">
                <th className="p-3.5">RANK</th>
                <th className="p-3.5">CALLSIGN</th>
                <th className="p-3.5">SCORE</th>
                <th className="p-3.5">STAGE</th>
                <th className="p-3.5">PLANE</th>
                <th className="p-3.5 hidden sm:table-cell">DIFFICULTY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {scores.map((record, index) => (
                <tr key={record.id || index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-black text-amber-400 flex items-center gap-1">
                    {index === 0 && <Medal className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    {index === 1 && <Medal className="w-4 h-4 text-slate-300 fill-slate-300" />}
                    {index === 2 && <Medal className="w-4 h-4 text-amber-600 fill-amber-600" />}
                    <span>#{index + 1}</span>
                  </td>
                  <td className="p-3.5 font-bold text-white">{record.name}</td>
                  <td className="p-3.5 font-black text-amber-300">{record.score.toLocaleString()}</td>
                  <td className="p-3.5 font-bold text-sky-400">Stage {record.stage}</td>
                  <td className="p-3.5 uppercase text-slate-300">{record.planeId}</td>
                  <td className="p-3.5 hidden sm:table-cell text-slate-400 font-sans">{record.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto flex justify-between items-center text-xs text-slate-500 pt-6">
        <span>PERSISTENT SCORES STORED LOCALLY</span>
        <button
          onClick={handleClear}
          className="text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> RESET LEADERBOARD
        </button>
      </div>
    </div>
  );
};
