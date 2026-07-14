import React, { useEffect, useState } from 'react';
import { Play, Clock, Target, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';

export function Assessments() {
  const { token } = useAppContext();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/assessments', {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.json())
        .then(data => {
          setAssessments(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl space-y-6">
        <div className="bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 border border-violet-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Mock Assessments</h2>
            <p className="text-sm text-slate-400">Test your knowledge under timed conditions before the real interview.</p>
          </div>
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <Target size={24} className="text-violet-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading assessments...</div>
        ) : assessments.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No assessments available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((test) => (
              <div key={test._id} className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-5 group hover:border-violet-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">{test.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/12 text-violet-400 whitespace-nowrap ml-2">
                    {test.xpReward} XP
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 mb-5 line-clamp-2 min-h-[32px]">{test.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5"><Clock size={13} className="text-slate-500"/> {test.timeLimitMinutes} min</div>
                  <div className="flex items-center gap-1.5"><ShieldAlert size={13} className="text-slate-500"/> {test.problems.length} Problems</div>
                </div>

                <button 
                  onClick={() => navigate(`/assessment/${test._id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-violet-600/20"
                >
                  <Play size={14} fill="currentColor" /> Start Assessment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
