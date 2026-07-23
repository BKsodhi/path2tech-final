import React from 'react';
import { Link } from 'react-router';
import { FileText, CheckSquare, ArrowRight } from 'lucide-react';

export function Diy() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c] flex items-center justify-center">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Do It Yourself (DIY)</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Take control of your career prep. Build an ATS-friendly resume or practice with our advanced AI Interview simulator.
          </p>
        </div>

        {/* Split Screen UI */}
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-16 items-stretch">
          
          {/* Card 1: Resume */}
          <div className="flex-1">
            <div className="h-full group bg-gradient-to-br from-indigo-500/10 to-[#0d1627] border border-indigo-500/20 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl transition-all hover:scale-[1.02] hover:border-indigo-500/40">
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                <FileText size={48} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Create a Resume</h2>
              <p className="text-slate-400 mb-8 max-w-sm">
                Analyze your current resume against real job descriptions using our AI ATS Matcher to ensure you bypass recruiter filters.
              </p>
              <div className="mt-auto w-full">
                <Link to="/resume" className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-colors">
                  Go to Resume Studio <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* OR Divider */}
          <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-px h-24 bg-white/10"></div>
            <div className="my-4 w-12 h-12 rounded-full bg-[#0d1627] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 z-10 shadow-xl">
              OR
            </div>
            <div className="w-px h-24 bg-white/10"></div>
          </div>

          {/* Mobile OR */}
          <div className="md:hidden flex items-center justify-center my-4">
            <div className="h-px w-full bg-white/10"></div>
            <span className="px-4 text-xs font-bold text-slate-500">OR</span>
            <div className="h-px w-full bg-white/10"></div>
          </div>

          {/* Card 2: AI Interview */}
          <div className="flex-1">
            <div className="h-full group bg-gradient-to-br from-emerald-500/10 to-[#0d1627] border border-emerald-500/20 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl transition-all hover:scale-[1.02] hover:border-emerald-500/40">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                <CheckSquare size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Take an AI Interview</h2>
              <p className="text-slate-400 mb-8 max-w-sm">
                Simulate a high-pressure technical interview environment with our Gemini-powered mock recruiter.
              </p>
              <div className="mt-auto w-full">
                <Link to="/diy/interviews" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-colors">
                  Setup Interview <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
