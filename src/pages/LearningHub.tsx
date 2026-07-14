import React, { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Database, Activity, Server, Cpu, Network, Box, PlayCircle, Lock } from "lucide-react";
import { Link } from "react-router";
import { useAppContext } from "../context/AppContext";
import { ProgressRing } from "../components/ProgressRing";

const iconMap: Record<string, React.ReactNode> = {
  "Database": <Database size={24} />,
  "Activity": <Activity size={24} />,
  "Server": <Server size={24} />,
  "Cpu": <Cpu size={24} />,
  "Network": <Network size={24} />,
  "Box": <Box size={24} />,
  "Lock": <Lock size={24} />
};

const colorMap: Record<string, string> = {
  "violet": "from-violet-500 to-fuchsia-500 text-violet-400 bg-violet-500/10",
  "orange": "from-orange-500 to-amber-500 text-orange-400 bg-orange-500/10",
  "cyan": "from-cyan-500 to-blue-500 text-cyan-400 bg-cyan-500/10",
  "rose": "from-rose-500 to-pink-500 text-rose-400 bg-rose-500/10",
  "emerald": "from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/10",
  "amber": "from-amber-500 to-yellow-500 text-amber-400 bg-amber-500/10"
};

export function LearningHub() {
  const { token } = useAppContext();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (token) {
      fetch('/api/content/topics', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token]);

  const tabs = ["All", "Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "OOPs", "System Design", "Web Development", "Machine Learning", "Cloud Computing", "Cybersecurity", "Computer Architecture"];

  const filteredTopics = activeTab === "All" ? topics : topics.filter(t => t.title === activeTab);

  if (loading) {
    return <div className="p-8 text-slate-400">Loading learning hub...</div>;
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Learning Hub</h1>
        <p className="text-sm text-slate-400">Explore, learn and understand concepts step-by-step.</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                  : "bg-[#111e35] text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111e35] border border-white/[0.06] rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const style = colorMap[topic.color] || colorMap["cyan"];
          const gradientClasses = style.split(' ').slice(0, 2).join(' ');
          const textClass = style.split(' ')[2];
          const bgClass = style.split(' ')[3];
          
          return (
            <Link to={`/learning-hub/${encodeURIComponent(topic.title)}`} key={topic._id} className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 group cursor-pointer relative overflow-hidden block">
              {/* Subtle background glow */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradientClasses} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{topic.title}</h3>
                  <div className="text-xs font-medium text-slate-500">{topic.totalTopics} Topics</div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${textClass} border border-current/20 shadow-inner`}>
                  {iconMap[topic.icon] || <BookOpen size={24} />}
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                {topic.description}
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Progress</span>
                  <span className={textClass}>0%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0a1020] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${gradientClasses} rounded-full w-0`} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
