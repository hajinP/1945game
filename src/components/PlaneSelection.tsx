import React, { useState, useEffect, useRef } from 'react';
import { PlaneInfo, PlaneId } from '../types/game';
import { PLANES } from '../data/planes';
import { drawPlayerPlane } from '../utils/sprites';
import { ChevronRight, Shield, Zap, Flame, Award } from 'lucide-react';

interface PlaneSelectionProps {
  onSelectPlane: (planeId: PlaneId) => void;
  onBack: () => void;
}

export const PlaneSelection: React.FC<PlaneSelectionProps> = ({ onSelectPlane, onBack }) => {
  const [selectedId, setSelectedId] = useState<PlaneId>('p38');
  const canvasRefs = useRef<{ [key in PlaneId]?: HTMLCanvasElement | null }>({});

  // Animate mini canvas plane previews
  useEffect(() => {
    let animId: number;
    let tick = 0;

    const renderPreviews = () => {
      tick++;
      PLANES.forEach((plane) => {
        const canvas = canvasRefs.current[plane.id];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw plane centered
            drawPlayerPlane(ctx, plane.id, canvas.width / 2, canvas.height / 2, 54, 54, tick);
          }
        }
      });
      animId = requestAnimationFrame(renderPreviews);
    };

    animId = requestAnimationFrame(renderPreviews);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentPlane = PLANES.find((p) => p.id === selectedId) || PLANES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 font-mono select-none">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <div>
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">AIR FORCE HANGAR</span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
            SELECT YOUR FIGHTER 🛩️
          </h1>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors border border-slate-700"
        >
          BACK TO MENU
        </button>
      </div>

      {/* Main Selection Area */}
      <div className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Plane Cards List */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLANES.map((plane) => {
            const isSelected = plane.id === selectedId;
            return (
              <div
                key={plane.id}
                onClick={() => setSelectedId(plane.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Canvas Preview */}
                  <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative">
                    <canvas
                      ref={(el) => (canvasRefs.current[plane.id] = el)}
                      width={64}
                      height={64}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{plane.code}</div>
                    <div className="text-base font-black text-white">{plane.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-sans">Power: {plane.power}/10</span>
                      <span className="text-[10px] text-slate-400 font-sans">Speed: {plane.speed}/10</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full">
                    SELECTED
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Selected Plane Specs */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold tracking-widest">{currentPlane.country}</span>
                <h2 className="text-2xl font-black text-white">{currentPlane.name}</h2>
              </div>
              <div className="w-20 h-20 bg-slate-950 rounded-xl border border-amber-400/30 flex items-center justify-center p-1">
                <canvas
                  ref={(el) => (canvasRefs.current[currentPlane.id] = el)}
                  width={80}
                  height={80}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans mb-6 leading-relaxed">
              {currentPlane.description}
            </p>

            {/* Stat Bars */}
            <div className="space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-400">
                  <span>AGILITY & SPEED</span>
                  <span className="text-amber-400">{currentPlane.speed}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${currentPlane.speed * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-400">
                  <span>FIREPOWER CANNON</span>
                  <span className="text-amber-400">{currentPlane.power}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${currentPlane.power * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-400">
                  <span>SPECIAL BOMB RADIUS</span>
                  <span className="text-amber-400">{currentPlane.bombPower}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${currentPlane.bombPower * 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Unique Skills */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Zap className="w-4 h-4 fill-amber-300" />
                <span>CHARGE ATTACK:</span>
                <span className="text-white font-normal">{currentPlane.chargeName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Flame className="w-4 h-4 fill-red-400" />
                <span>SUPER BOMB:</span>
                <span className="text-white font-normal">{currentPlane.bombName}</span>
              </div>
            </div>
          </div>

          {/* Start Mission Button */}
          <button
            onClick={() => onSelectPlane(currentPlane.id)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>SORTIE MISSION!</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500">
        STRIKERS 1945 ARCADE EDITION • SELECT PLANE & LAUNCH INTO BATTLE
      </div>
    </div>
  );
};
