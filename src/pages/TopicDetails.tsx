import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronLeft, Code2, BookOpen, Clock, Target, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function TopicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAppContext();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      fetch('/api/content/problems', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        // Filter problems whose tags include the topic title (basic match)
        // Since we seeded tags like ["Arrays", "Hash Maps"], and topic title might be "Data Structures",
        // for now we'll just show all problems if it's DSA or filter if exact tags exist.
        // As a fallback to show UI, if no matches, just show a few problems.
        let matched = data.filter((p: any) => p.tags.some((t: string) => t.toLowerCase().includes(id.toLowerCase())));
        if (matched.length === 0) matched = data; // fallback just for demonstration
        setProblems(matched);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, id]);

  const easy = problems.filter(p => p.difficulty === "Easy");
  const medium = problems.filter(p => p.difficulty === "Medium");
  const hard = problems.filter(p => p.difficulty === "Hard");

  if (loading) {
    return <div className="p-8 text-slate-400">Loading topic...</div>;
  }

  const renderSection = (title: string, list: any[], colorClass: string, bgClass: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bgClass} ${colorClass}`}>
            {title}
          </span>
          <span className="text-xs text-slate-500 font-medium">{list.length} Problems</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {list.map(p => {
            const isVerbal = p.tags.includes("Verbal");
            const route = isVerbal 
              ? `/interview?topic=${encodeURIComponent(id || '')}&question=${encodeURIComponent(p.title)}`
              : `/coding/${p._id}`;
            const actionText = isVerbal ? "SPEAK" : "SOLVE";
            const actionColor = isVerbal ? "text-violet-500 group-hover:text-violet-400" : "text-cyan-500 group-hover:text-cyan-400";
            
            return (
            <Link to={route} key={p._id} className="bg-[#111e35] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors group flex flex-col justify-between h-32">
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white mb-1 transition-colors">{p.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{p.tags.join(" · ")}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-white/[0.04] pt-3">
                <span className="text-xs font-semibold text-slate-400">+{p.xp} XP</span>
                <div className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${actionColor}`}>
                  {actionText} <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-5 bg-[#0d1627]" style={{ scrollbarWidth: "none" }}>
      <button 
        onClick={() => navigate('/learning-hub')}
        className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Back to Learning Hub
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">{id}</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Master the concepts of {id} through curated coding challenges. Start with easy problems to build your foundation, and work your way up to interview-level hard questions.
        </p>
      </div>

      <div className="space-y-2">
        {renderSection("Easy", easy, "text-emerald-400", "bg-emerald-500/10")}
        {renderSection("Medium", medium, "text-amber-400", "bg-amber-500/10")}
        {renderSection("Hard", hard, "text-rose-400", "bg-rose-500/10")}
      </div>
    </div>
  );
}
