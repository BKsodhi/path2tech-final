import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Star, Flame, Code2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Leaderboard() {
  const { user } = useAppContext();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-yellow-600/15 to-amber-600/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Global Leaderboard</h2>
            <p className="text-sm text-slate-400">Compete with coders worldwide. Rank up by solving problems and maintaining your streak.</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <Trophy size={24} className="text-yellow-400" />
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && users.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mt-12 mb-10 h-48">
            {/* Rank 2 */}
            <div className="flex flex-col items-center w-1/3">
              <div className="text-sm font-bold text-slate-300 mb-2 truncate max-w-[100px]">{users[1].name}</div>
              <div className="w-full bg-slate-400/20 border-t-2 border-slate-300 rounded-t-lg h-32 flex flex-col justify-start pt-3 items-center">
                <Medal size={28} className="text-slate-300 mb-1" />
                <span className="text-lg font-bold text-white">#2</span>
                <span className="text-xs text-slate-400 mt-1">{users[1].careerScore}% Score</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center w-1/3 z-10">
              <div className="text-sm font-bold text-yellow-400 mb-2 truncate max-w-[120px]">{users[0].name}</div>
              <div className="w-full bg-yellow-500/20 border-t-4 border-yellow-400 rounded-t-lg h-40 flex flex-col justify-start pt-3 items-center shadow-[0_0_30px_rgba(250,204,21,0.15)]">
                <Trophy size={36} className="text-yellow-400 mb-1" />
                <span className="text-xl font-bold text-white">#1</span>
                <span className="text-xs text-yellow-500/80 mt-1">{users[0].careerScore}% Score</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center w-1/3">
              <div className="text-sm font-bold text-amber-600 mb-2 truncate max-w-[100px]">{users[2].name}</div>
              <div className="w-full bg-amber-600/20 border-t-2 border-amber-600 rounded-t-lg h-24 flex flex-col justify-start pt-3 items-center">
                <Medal size={24} className="text-amber-600 mb-1" />
                <span className="text-lg font-bold text-white">#3</span>
                <span className="text-xs text-slate-400 mt-1">{users[2].careerScore}% Score</span>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Solved</div>
            <div className="col-span-3 text-right">Streak</div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading ranks...</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {users.map((u, i) => (
                <div key={u._id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/[0.02] ${user?.name === u.name ? "bg-cyan-500/5" : ""}`}>
                  <div className="col-span-1 text-sm font-bold text-slate-500">#{i + 1}</div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
                      {u.name.substring(0,2).toUpperCase()}
                    </div>
                    <span className={`text-sm font-semibold truncate ${user?.name === u.name ? "text-cyan-400" : "text-slate-200"}`}>{u.name} {user?.name === u.name && "(You)"}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400">
                      <Star size={14} fill="currentColor" /> {u.careerScore}%
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300">
                      <Code2 size={14} className="text-slate-500" /> {u.problemsSolved}
                    </span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-400">
                      <Flame size={14} fill="currentColor" /> {u.streak} Days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
