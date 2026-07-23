import React, { useState } from 'react';
import { ArrowRight, Code2, BrainCircuit, LineChart, Target, Zap } from 'lucide-react';
import { Link } from 'react-router';

export function Assignments() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Marketing', 'AI', 'CODING', 'Finance', 'CS'];
  
  const assignments = [
    { id: 1, title: 'React Hooks Mastery', category: 'CODING', icon: <Code2 size={32} className="text-cyan-400" /> },
    { id: 2, title: 'Intro to Neural Networks', category: 'AI', icon: <BrainCircuit size={32} className="text-purple-400" /> },
    { id: 3, title: 'Financial Modeling Basics', category: 'Finance', icon: <LineChart size={32} className="text-emerald-400" /> },
    { id: 4, title: 'Digital Marketing Strategy', category: 'Marketing', icon: <Target size={32} className="text-orange-400" /> },
    { id: 5, title: 'Operating Systems Quiz', category: 'CS', icon: <Zap size={32} className="text-yellow-400" /> },
    { id: 6, title: 'Advanced Data Structures', category: 'CODING', icon: <Code2 size={32} className="text-cyan-400" /> },
  ];

  const filteredAssignments = activeCategory === 'All' 
    ? assignments 
    : assignments.filter(a => a.category === activeCategory);

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assignments</h1>
          <p className="text-slate-400 text-sm mt-1">Complete your required coursework below.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.06] hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssignments.map((item) => (
            <div key={item.id} className="group bg-[#0d1627] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition-all hover:bg-white/[0.02] hover:border-white/[0.1] hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 border border-white/[0.05] group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <div className="mt-auto pt-6 w-full">
                <Link to="#" className="w-full py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-semibold text-sm flex items-center justify-center gap-2 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                  Take Assignment <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
