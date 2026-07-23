import React from 'react';
import { MessageSquare, Briefcase, FileText, History, Ghost, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function DiyInterviews() {
  const interviewTypes = [
    {
      title: "Free Form Interview",
      description: "General software engineering questions tailored to your chosen topic.",
      icon: <MessageSquare size={28} className="text-cyan-400" />,
      bgClass: "from-cyan-500/10 to-blue-600/10 border-cyan-500/20"
    },
    {
      title: "Job Description Based",
      description: "Paste a real JD and get grilled on exactly what the company is looking for.",
      icon: <Briefcase size={28} className="text-emerald-400" />,
      bgClass: "from-emerald-500/10 to-teal-600/10 border-emerald-500/20"
    },
    {
      title: "Resume Based",
      description: "Upload your resume and prepare to defend your past projects and experience.",
      icon: <FileText size={28} className="text-purple-400" />,
      bgClass: "from-purple-500/10 to-pink-600/10 border-purple-500/20"
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Section: Start New Interview */}
        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Start New Interview</h1>
            <p className="text-slate-400 text-sm mt-1">Select the format for your mock technical interview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewTypes.map((type, idx) => (
              <div 
                key={idx}
                className={`group flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${type.bgClass} border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 border border-white/10 group-hover:bg-white/[0.1] transition-colors">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{type.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {type.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link 
                    to="/interview"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors"
                  >
                    Start Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section: Interview History */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
              <History size={16} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interview History</h2>
          </div>

          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5">
              <Ghost size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">No Interview History</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              You haven't completed any mock interviews yet. Select a format above to start practicing!
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
