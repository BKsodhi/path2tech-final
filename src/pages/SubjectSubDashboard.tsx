import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeft, Mic, Code2, Target, BarChart2, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { VoiceTheoryModule } from '../components/subject/VoiceTheoryModule';
import { VocalMcqModule } from '../components/subject/VocalMcqModule';
import { InteractiveCodingArena } from '../components/subject/InteractiveCodingArena';
import { SubjectAnalyticsModule } from '../components/subject/SubjectAnalyticsModule';

export function SubjectSubDashboard() {
  const { subject } = useParams();
  const { token } = useAppContext();
  const [activeTab, setActiveTab] = useState<'theory' | 'mcq' | 'coding' | 'analytics'>('theory');
  const [content, setContent] = useState<any>({ theory: [], mcq: [], coding: [] });
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && subject) {
      fetch(`/api/learning-hub/${encodeURIComponent(subject)}`, {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        setContent(data.content);
        setProgress(data.progress);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, subject]);

  if (loading) {
    return <div className="p-8 text-slate-400">Loading learning environment...</div>;
  }

  const tabs = [
    { id: 'theory', label: 'Voice Theory & Viva', icon: Mic, items: content.theory },
    { id: 'mcq', label: 'Vocal MCQs', icon: Target, items: content.mcq },
    { id: 'coding', label: 'Coding Arena', icon: Code2, items: content.coding },
    { id: 'analytics', label: 'Performance Matrix', icon: BarChart2, items: [] }
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#0d1627] px-6 py-6" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Panel */}
        <div className="mb-6">
          <Link 
            to="/learning-hub"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={14} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {subject}
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Master complex concepts through voice articulation, interactive AI viva sessions, and raw typed coding challenges.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg shadow-sm">
              <Zap size={14} className="text-violet-400" />
              <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Speech-First AI Enabled</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-[#111e35] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.items.length > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.06] text-slate-500'}`}>
                    {tab.items.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Render Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'theory' && <VoiceTheoryModule subject={subject} items={content.theory} progress={progress} />}
          {activeTab === 'mcq' && <VocalMcqModule subject={subject} items={content.mcq} progress={progress} />}
          {activeTab === 'coding' && <InteractiveCodingArena subject={subject} items={content.coding} progress={progress} />}
          {activeTab === 'analytics' && <SubjectAnalyticsModule subject={subject} progress={progress} content={content} />}
        </div>

      </div>
    </div>
  );
}
