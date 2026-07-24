import React from 'react';
import { GameSettings } from '../types/game';
import { Settings as SettingsIcon, Volume2, Shield, Keyboard, Touchpad, MousePointer, X } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  setSettings,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <SettingsIcon className="w-5 h-5 text-sky-400" />
            <span>GAME SETTINGS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Volume */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> SFX VOLUME
              </span>
              <span className="text-emerald-400">{settings.sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume}
              onChange={(e) => setSettings((s) => ({ ...s, sfxVolume: Number(e.target.value) }))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" /> BGM MUSIC VOLUME
              </span>
              <span className="text-amber-400">{settings.bgmVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.bgmVolume}
              onChange={(e) => setSettings((s) => ({ ...s, bgmVolume: Number(e.target.value) }))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Control Mode Selector */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            PRIMARY CONTROL MODE
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { mode: 'KEYBOARD', icon: Keyboard, label: 'KEYBOARD' },
              { mode: 'MOUSE', icon: MousePointer, label: 'MOUSE' },
              { mode: 'TOUCH', icon: Touchpad, label: 'TOUCH DRAG' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setSettings((s) => ({ ...s, controlMode: mode as GameSettings['controlMode'] }))}
                className={`py-3 px-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all ${
                  settings.controlMode === mode
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};
