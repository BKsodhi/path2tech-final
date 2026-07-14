import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BookOpen, Target, Clock, Zap, Award, Flame } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function Analytics() {
  const { streak, problemsSolved, careerScore, dsaScore, systemDesignScore, behavioralScore, token } = useAppContext();

  const [analyticsData, setAnalyticsData] = useState({
    timeInvested: "0h 0m",
    questionsSolved: 0,
    accuracy: 0,
    topicsMastered: 0,
    progressData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/analytics', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.message) {
          setAnalyticsData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token]);

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-sm text-slate-400">Your journey at a glance. Track your consistency and growth.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Time Invested", val: analyticsData.timeInvested, sub: "Based on active submissions", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Questions Solved", val: analyticsData.questionsSolved.toString(), sub: "Total distinct problems", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Accuracy", val: `${analyticsData.accuracy}%`, sub: "Overall acceptance rate", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Topics Mastered", val: analyticsData.topicsMastered.toString(), sub: "Out of 12 core subjects", icon: Award, color: "text-violet-400", bg: "bg-violet-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={13} className={stat.color} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white mb-1">{stat.val}</div>
              <div className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Progress Line Chart */}
        <div className="col-span-2 bg-[#111e35] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-200">Learning Progress Over Time</h3>
            <select className="text-xs bg-[#0a1020] border border-white/[0.06] text-slate-400 rounded-lg px-2 py-1 outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#0a1020", borderColor: "rgba(255,255,255,0.1)", borderRadius: '8px' }}
                  itemStyle={{ color: "#06b6d4", fontWeight: 600 }}
                  labelStyle={{ color: "#94a3b8", marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Subjects Breakdown */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-200 mb-6">Top Subjects</h3>
          <div className="flex-1 space-y-5">
            {[
              { name: "Data Structures", pct: dsaScore || 0, color: "bg-violet-500" },
              { name: "Algorithms", pct: dsaScore ? Math.max(0, dsaScore - 15) : 0, color: "bg-orange-500" },
              { name: "System Design", pct: systemDesignScore || 0, color: "bg-cyan-500" },
              { name: "Behavioral", pct: behavioralScore || 0, color: "bg-rose-500" }
            ].map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">{sub.name}</span>
                  <span className="text-slate-500 font-bold">{sub.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0a1020] rounded-full overflow-hidden">
                  <div className={`h-full ${sub.color} rounded-full transition-all duration-1000`} style={{ width: `${sub.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Current Streak</div>
              <div className="text-lg font-extrabold text-orange-400 flex items-center gap-1.5">
                <Flame size={18} fill="currentColor" />
                {streak} Days
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium mb-1">Career Score</div>
              <div className="text-lg font-extrabold text-emerald-400">
                {careerScore}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
