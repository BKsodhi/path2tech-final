import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function SubmissionsList({ problemId }: { problemId: string }) {
  const { token } = useAppContext();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && problemId) {
      fetch(`/api/submissions/problem/${problemId}`, {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.json())
        .then(data => {
          setSubmissions(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token, problemId]);

  if (loading) return <div className="text-slate-500 text-sm p-4">Loading submissions...</div>;

  if (submissions.length === 0) {
    return <div className="text-slate-500 text-sm p-4">No submissions yet. Run your code to submit!</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white mb-2">Past Submissions</h3>
      {submissions.map((sub) => (
        <div key={sub._id} className="bg-[#111e35] border border-white/[0.06] rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {sub.status === 'Accepted' ? (
                <CheckCircle size={16} className="text-emerald-400" />
              ) : (
                <XCircle size={16} className="text-rose-400" />
              )}
              <span className={`text-sm font-bold ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {sub.status}
              </span>
            </div>
            <span className="text-xs text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1"><Clock size={12} /> {sub.executionTimeMs} ms</span>
            <span className="px-2 py-0.5 bg-white/[0.05] rounded uppercase">{sub.language}</span>
          </div>
          <div className="bg-[#0a1020] rounded-lg p-3 overflow-x-auto">
            <pre className="text-[10px] font-mono text-slate-300">
              <code>{sub.code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
