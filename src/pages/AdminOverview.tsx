import React, { useEffect, useState } from 'react';
import { Users, FileCode2, Target, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function AdminOverview() {
  const { token } = useAppContext();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/admin/stats', {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }, [token]);

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-400">Loading Stats...</div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { title: 'Coding Problems', value: stats?.totalProblems || 0, icon: FileCode2, color: 'emerald' },
    { title: 'Mock Assessments', value: stats?.totalAssessments || 0, icon: Target, color: 'violet' },
    { title: 'Total Submissions', value: stats?.totalSubmissions || 0, icon: CheckCircle2, color: 'cyan' },
  ];

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Platform Overview</h1>
          <p className="text-slate-400 text-sm">Monitor your application's growth and active content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/10 rounded-full blur-2xl`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-${card.color}-500/20 flex items-center justify-center`}>
                  <card.icon size={20} className={`text-${card.color}-400`} />
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="text-3xl font-extrabold text-white mb-1">{card.value}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for future charts */}
        <div className="mt-8 bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 h-64 flex items-center justify-center text-slate-500 text-sm">
          Activity Charts Coming Soon
        </div>
        
      </div>
    </div>
  );
}
