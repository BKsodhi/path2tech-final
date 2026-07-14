import React from 'react';
import { Trophy, Lock, Star, Zap, Code2, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Achievements() {
  const { streak, problemsSolved, careerScore } = useAppContext();

  const badges = [
    { id: 1, title: "First Step", desc: "Solve your first problem", icon: Code2, earned: problemsSolved >= 1, color: "emerald" },
    { id: 2, title: "On Fire", desc: "Reach a 7-day streak", icon: Zap, earned: streak >= 7, color: "orange" },
    { id: 3, title: "Consistent", desc: "Reach a 30-day streak", icon: Zap, earned: streak >= 30, color: "orange" },
    { id: 4, title: "Century", desc: "Solve 100 problems", icon: Target, earned: problemsSolved >= 100, color: "cyan" },
    { id: 5, title: "Top Tier", desc: "Reach 90% Career Score", icon: Star, earned: careerScore >= 90, color: "yellow" },
    { id: 6, title: "Resume Master", desc: "Achieve 95% ATS match", icon: Trophy, earned: false, color: "rose" },
  ];

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl space-y-6">
        <div className="bg-gradient-to-r from-yellow-600/15 to-amber-600/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Your Achievements</h2>
            <p className="text-sm text-slate-400">Unlock badges by solving problems, maintaining streaks, and improving your profile.</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <Trophy size={24} className="text-yellow-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.id} className={`bg-[#111e35] border rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 ${
              b.earned ? `border-${b.color}-500/30 shadow-lg shadow-${b.color}-500/10` : "border-white/[0.04] opacity-50 grayscale hover:grayscale-0"
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                b.earned ? `bg-${b.color}-500/20` : "bg-white/[0.05]"
              }`}>
                {b.earned ? <b.icon size={32} className={`text-${b.color}-400`} /> : <Lock size={24} className="text-slate-600" />}
              </div>
              <h3 className={`text-base font-bold mb-1 ${b.earned ? 'text-white' : 'text-slate-400'}`}>{b.title}</h3>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
