import React from 'react';
import { BarChart2, Mic, Code2, Trophy, BrainCircuit } from 'lucide-react';

export function SubjectAnalyticsModule({ subject, progress, content }: { subject: string, progress: any, content: any }) {
  const totalItems = content.theory.length + content.mcq.length + content.coding.length;
  const completedCount = progress?.completedItems?.length || 0;
  const completionPercentage = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
  
  const vocalScore = progress?.vocalAccuracyScore || 0;
  const codingScore = progress?.codingSuccessRate || 0;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <BarChart2 size={12} /> Performance Matrix
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          {subject} Mastery
        </h2>
        <p className="text-slate-400 text-sm">Track your vocal precision and coding proficiency in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Vocal Score */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/20">
            <Mic size={20} />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">
            {vocalScore}<span className="text-lg text-violet-400 ml-1">%</span>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vocal Precision</div>
        </div>

        {/* Overall Progress */}
        <div className="bg-[#0a1020] border border-cyan-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20 relative z-10">
            <Trophy size={24} />
          </div>
          <div className="text-5xl font-extrabold text-white mb-1 relative z-10">
            {completionPercentage}<span className="text-xl text-cyan-400 ml-1">%</span>
          </div>
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest relative z-10">Subject Mastery</div>
        </div>

        {/* Coding Score */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
            <Code2 size={20} />
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">
            {codingScore}<span className="text-lg text-emerald-400 ml-1">%</span>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coding Success</div>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="text-slate-400" size={16} />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Neural Pathway Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a1020] rounded-xl p-5 border border-white/[0.04]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Module 01</div>
                <div className="text-sm font-bold text-slate-200">Theory & Viva</div>
              </div>
              <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">{content.theory.length}</span>
            </div>
            <div className="h-2 w-full bg-[#111e35] rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          
          <div className="bg-[#0a1020] rounded-xl p-5 border border-white/[0.04]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Module 02</div>
                <div className="text-sm font-bold text-slate-200">Vocal MCQs</div>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{content.mcq.length}</span>
            </div>
            <div className="h-2 w-full bg-[#111e35] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
          
          <div className="bg-[#0a1020] rounded-xl p-5 border border-white/[0.04]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Module 03</div>
                <div className="text-sm font-bold text-slate-200">Coding Arena</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{content.coding.length}</span>
            </div>
            <div className="h-2 w-full bg-[#111e35] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
