import React from "react";
import {
  Star,
  ArrowRight,
  Target,
  TrendingUp,
  FileText,
  CheckCircle,
  Code2,
  CheckCheck,
  Trophy,
  Lock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProgressRing } from "../components/ProgressRing";
import { ActivityHeatmap } from "../components/dashboard/ActivityHeatmap";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

const streakData = [
  { day: "Mon", problems: 0 },
  { day: "Tue", problems: 0 },
  { day: "Wed", problems: 0 },
  { day: "Thu", problems: 0 },
  { day: "Fri", problems: 0 },
  { day: "Sat", problems: 0 },
  { day: "Sun", problems: 0 },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { streak, problemsSolved, careerScore, dsaScore, systemDesignScore, behavioralScore, resumeMatch, user, token } = useAppContext();
  const [problems, setProblems] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (token) {
      fetch('/api/content/problems', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => setProblems(data.slice(0, 5)))
      .catch(err => console.error(err));
    }
  }, [token]);

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: "none" }}>
      {/* Greeting card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2a4a] via-[#0c2242] to-[#0f1e3a] border border-cyan-500/15 p-6">
        <div className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(6,182,212,0.12), transparent)" }}
        />
        <div className="absolute right-6 top-6 flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= 2 ? "bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" : "bg-slate-700"}`} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2.5">
            <Star size={13} className="text-yellow-400" fill="#facc15" />
            <span className="text-[11px] font-bold text-yellow-400/80 uppercase tracking-widest">Daily Goal: 3 Problems</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome back, {user ? user.name.split(' ')[0] : "Loading"}! Ready to level up? 🚀</h1>
            <p className="text-sm text-slate-400 mt-1">You solved {problemsSolved} problems total — that's great consistency! Let's push for more today. Small steps, big results.</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => navigate("/coding")}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 shadow-md shadow-cyan-500/25 hover:shadow-cyan-400/30"
            >
              Continue Coding <ArrowRight size={14} />
            </button>
            <button className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150">
              View Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* 3-column widget row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Career Readiness Ring */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Career Readiness</h3>
              <p className="text-xs text-slate-500 mt-0.5">Overall score</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Target size={15} className="text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <ProgressRing percent={careerScore} size={128} stroke={9} color="#06b6d4" trackColor="#1a2d4a" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white leading-none">{careerScore}%</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Overall</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "DSA", val: dsaScore, color: "#06b6d4" },
              { label: "System Design", val: systemDesignScore, color: "#8b5cf6" },
              { label: "Behavioral", val: behavioralScore, color: "#10b981" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-slate-300 font-medium">{val}%</span>
                </div>
                <div className="h-1.5 bg-[#1a2d4a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Chart */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Coding Streaks</h3>
              <p className="text-xs text-slate-500 mt-0.5">Problems solved this week</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp size={15} className="text-orange-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <BarChart data={streakData} barSize={16} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{ background: "#162032", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 10, fontSize: 12, fontFamily: "Plus Jakarta Sans" }}
                labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
                itemStyle={{ color: "#fb923c" }}
              />
              <Bar dataKey="problems" fill="#f97316" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-slate-500 font-medium">Total Solved</div>
              <div className="text-lg font-bold text-cyan-400">{problemsSolved} problems</div>
            </div>
        </div>

        {/* ATS Resume */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">AI Resume Match</h3>
              <p className="text-xs text-slate-500 mt-0.5">ATS compatibility</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileText size={15} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-center py-3">
            <div className="text-5xl font-extrabold text-white mb-2 leading-none">{resumeMatch}<span className="text-2xl text-slate-400">%</span></div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle size={11} /> {resumeMatch >= 80 ? "On Track" : "Needs Work"}
            </span>
          </div>
          <div className="mt-3 space-y-2.5 flex-1">
            {[
              { label: "Keywords matched", val: "24 / 28", ok: true },
              { label: "Format score", val: "Excellent", ok: true },
              { label: "Missing skills", val: "Docker, K8s", ok: false },
            ].map(({ label, val, ok }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{label}</span>
                <span className={`font-semibold ${ok ? "text-emerald-400" : "text-amber-400"}`}>{val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/resume")}
            className="mt-4 w-full text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/15 hover:border-cyan-500/30 py-2 rounded-xl transition-all duration-150 hover:bg-cyan-500/5"
          >
            Improve Resume →
          </button>
        </div>
      </div>

      {/* Activity Heatmap row */}
      <ActivityHeatmap />

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4 pb-4">
        {/* Recommended Problems */}
        <div className="col-span-2 bg-[#111e35] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Recommended for You</h3>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">View all →</button>
          </div>
          <div className="space-y-1.5">
            {problems.map((prob) => (
              <div
                key={prob._id}
                onClick={() => {
                  const isVerbal = prob.tags?.includes("Verbal");
                  const dest = isVerbal 
                    ? `/interview?topic=${prob.tags[0]}&question=${encodeURIComponent(prob.title)}`
                    : `/coding/${prob._id}`;
                  navigate(dest);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1a2d4a]`}>
                  <Code2 size={13} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{prob.title}</div>
                  <div className="text-xs text-slate-600">{prob.tags?.join(', ')}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  prob.difficulty === "Easy" ? "bg-emerald-500/12 text-emerald-400"
                  : prob.difficulty === "Medium" ? "bg-amber-500/12 text-amber-400"
                  : "bg-rose-500/12 text-rose-400"
                }`}>{prob.difficulty}</span>
                <span className="text-xs text-slate-600 w-14 text-right">+{prob.xp || 50} XP</span>
              </div>
            ))}
            {problems.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">Loading problems...</div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Achievements</h3>
            <Trophy size={14} className="text-yellow-400" />
          </div>
          <div className="space-y-2.5">
            {[
              { emoji: "🔥", label: `${streak}-Day Streak`, sub: "Maintaining the fire!", earned: streak >= 14 },
              { emoji: "⚡", label: "Speed Coder", sub: "Solved in under 5 min", earned: true },
              { emoji: "🏆", label: "Top 10%", sub: "Weekly leaderboard", earned: true },
              { emoji: "🌟", label: "Consistency King", sub: "30-day streak needed", earned: streak >= 30 },
              { emoji: "🎯", label: "100 Problems", sub: `${problemsSolved} / 100 solved`, earned: problemsSolved >= 100 },
            ].map(({ emoji, label, sub, earned }) => (
              <div key={label} className={`flex items-center gap-3 transition-opacity ${earned ? "opacity-100" : "opacity-35"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${earned ? "bg-yellow-500/10 border border-yellow-500/15" : "bg-[#1a2d4a]"}`}>
                  {earned ? emoji : <Lock size={12} className="text-slate-600" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-300 leading-tight">{label}</div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
