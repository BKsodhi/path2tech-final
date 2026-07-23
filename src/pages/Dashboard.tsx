import React, { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  BrainCircuit, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
  const { user } = useAppContext();
  
  // Dummy data for the Recharts AreaChart
  const performanceData = [
    { date: 'Jun 30', you: 65, class: 60 },
    { date: 'Jul 04', you: 68, class: 62 },
    { date: 'Jul 08', you: 74, class: 65 },
    { date: 'Jul 12', you: 72, class: 67 },
    { date: 'Jul 16', you: 85, class: 70 },
    { date: 'Jul 20', you: 88, class: 72 },
    { date: 'Jul 23', you: 92, class: 75 },
  ];

  // Dummy data for Strengths & Weaknesses
  const strengthsWeaknesses = [
    { criteria: 'Algorithms', performance: 'Excellent', score: 95, color: 'text-emerald-400' },
    { criteria: 'Data Structures', performance: 'Good', score: 82, color: 'text-cyan-400' },
    { criteria: 'System Design', performance: 'Average', score: 65, color: 'text-amber-400' },
    { criteria: 'Communication', performance: 'Needs Work', score: 45, color: 'text-red-400' },
  ];

  // Dummy data for Assignments
  const allAssignments = [
    { id: 1, name: 'Marketing 101 Basics', type: 'Marketing', attempts: 1, status: 'COMPLETED', score: 88, classAvg: 75 },
    { id: 2, name: 'AI Prompt Engineering', type: 'AI', attempts: 2, status: 'COMPLETED', score: 92, classAvg: 80 },
    { id: 3, name: 'React Hooks Deep Dive', type: 'CODING', attempts: 1, status: 'PENDING', score: null, classAvg: 85 },
    { id: 4, name: 'Financial Modeling', type: 'Finance', attempts: 0, status: 'REGISTERED', score: null, classAvg: null },
    { id: 5, name: 'Operating Systems Quiz', type: 'CS', attempts: 3, status: 'COMPLETED', score: 76, classAvg: 70 },
    { id: 6, name: 'Advanced CSS Grid', type: 'CODING', attempts: 1, status: 'COMPLETED', score: 95, classAvg: 82 },
    { id: 7, name: 'Machine Learning Concepts', type: 'AI', attempts: 0, status: 'OVERDUE', score: null, classAvg: null },
  ];

  // Client-Side Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allAssignments.length / itemsPerPage);
  
  const paginatedAssignments = allAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'PENDING': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'REGISTERED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Registered</span>;
      case 'OVERDUE': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Overdue</span>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Track your overarching performance across all modules.</p>
        </div>

        {/* TOP ROW: 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <CheckCircle2 size={24} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Assignments Done</div>
            </div>
          </div>
          
          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">88%</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Avg Assignment Score</div>
            </div>
          </div>

          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <BrainCircuit size={24} className="text-purple-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Practices This Month</div>
            </div>
          </div>

          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Target size={24} className="text-orange-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">92%</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Avg Practice Score</div>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Chart (60%) & Strengths/Weaknesses (40%) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Card */}
          <div className="lg:w-3/5 bg-[#0d1627] border border-white/[0.06] rounded-2xl p-6 flex flex-col shadow-lg shadow-black/20">
            <h3 className="text-lg font-bold text-white mb-6">Performance Trend Over Time: You vs Class</h3>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="you" name="Your Score" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorYou)" />
                  <Area type="monotone" dataKey="class" name="Class Average" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorClass)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Weaknesses Card */}
          <div className="lg:w-2/5 bg-[#0d1627] border border-white/[0.06] rounded-2xl p-6 flex flex-col shadow-lg shadow-black/20">
            <h3 className="text-lg font-bold text-white mb-6">Strengths & Weaknesses</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-white/[0.02] border-b border-white/[0.06]">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg">Criteria</th>
                    <th className="px-4 py-3 font-semibold">Performance</th>
                    <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {strengthsWeaknesses.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-200">{item.criteria}</td>
                      <td className={`px-4 py-3.5 font-semibold ${item.color}`}>{item.performance}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-white">{item.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Paginated Assignments Table */}
        <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">My Assignments</h3>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-[#090e1c] border-b border-white/[0.06]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Assignment Name</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold text-center">Attempts</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold text-center">Your Score</th>
                  <th className="px-5 py-4 font-semibold text-center">Class Avg</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {paginatedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-200">{assignment.name}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-md">{assignment.type}</span>
                    </td>
                    <td className="px-5 py-4 text-center text-slate-300">{assignment.attempts}</td>
                    <td className="px-5 py-4">{getStatusBadge(assignment.status)}</td>
                    <td className="px-5 py-4 text-center font-bold text-white">{assignment.score !== null ? `${assignment.score}%` : '-'}</td>
                    <td className="px-5 py-4 text-center text-slate-400">{assignment.classAvg !== null ? `${assignment.classAvg}%` : '-'}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold inline-flex items-center gap-1 group transition-colors">
                        View Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="text-xs text-slate-400 font-medium">
              Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, allAssignments.length)}</span> of <span className="text-white">{allAssignments.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-semibold text-white px-3">{currentPage} <span className="text-slate-500 font-normal">/ {totalPages}</span></div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
