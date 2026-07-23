import React from 'react';
import { Brain, CheckCircle2, TrendingUp, Search, Filter, SearchX } from 'lucide-react';

export function AptitudeTest() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Aptitude Tests</h1>
          <p className="text-slate-400 text-sm mt-1">Evaluate your logical, quantitative, and verbal reasoning skills.</p>
        </div>

        {/* Top Row: KPI Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
              <Brain size={24} className="text-pink-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Total Tests</div>
            </div>
          </div>

          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Completed</div>
            </div>
          </div>

          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <TrendingUp size={24} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0%</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Middle Row: Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search aptitude tests..." 
              className="w-full pl-11 pr-4 py-3 bg-[#0d1627] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
          </div>
          <button className="flex items-center justify-center w-12 h-12 bg-[#0d1627] border border-white/[0.06] rounded-xl hover:bg-white/[0.02] hover:border-white/[0.1] transition-all text-slate-400 hover:text-white">
            <Filter size={20} />
          </button>
        </div>

        {/* Bottom Section: Empty State */}
        <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-lg mt-8">
          <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-white/5">
            <SearchX size={40} className="text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300">No Aptitude Tests Found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            There are currently no aptitude tests available in your catalog. Check back later or contact your instructor.
          </p>
        </div>

      </div>
    </div>
  );
}
