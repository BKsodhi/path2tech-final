import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Save, ServerCrash, Trash2, Code2, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ContentManager } from '../components/admin/ContentManager';

export function AdminDashboard() {
  const { token } = useAppContext();
  const [activeTab, setActiveTab] = useState<'problem' | 'assessment' | 'list' | 'content'>('list');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  
  // Data states
  const [problems, setProblems] = useState<any[]>([]);

  // Form states
  const [problemForm, setProblemForm] = useState({
    title: '', description: '', difficulty: 'Medium', tags: '', xp: 100, starterCode: '', testCases: ''
  });
  
  const [assessmentForm, setAssessmentForm] = useState({
    title: '', description: '', timeLimitMinutes: 30, xpReward: 500, selectedProblems: [] as string[]
  });

  useEffect(() => {
    fetchProblems();
  }, [token]);

  const fetchProblems = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/content/problems', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    try {
      const res = await fetch(`/api/admin/problems/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '' }
      });
      if (res.ok) {
        setProblems(problems.filter(p => p._id !== id));
        setStatus({ message: 'Problem deleted.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });
    
    try {
      const tagsArray = problemForm.tags.split(',').map(t => t.trim()).filter(t => t);
      let parsedTestCases = [];
      try {
        parsedTestCases = JSON.parse(problemForm.testCases || '[]');
      } catch {
        parsedTestCases = [{ input: "default", expectedOutput: "default" }];
      }

      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          title: problemForm.title,
          description: problemForm.description,
          difficulty: problemForm.difficulty,
          tags: tagsArray,
          xp: Number(problemForm.xp),
          starterCode: problemForm.starterCode,
          testCases: parsedTestCases
        })
      });

      if (res.ok) {
        setStatus({ message: 'Problem uploaded successfully!', type: 'success' });
        setProblemForm({ title: '', description: '', difficulty: 'Medium', tags: '', xp: 100, starterCode: '', testCases: '' });
        fetchProblems();
      } else {
        setStatus({ message: 'Failed to upload problem.', type: 'error' });
      }
    } catch (err) {
      setStatus({ message: 'Network error.', type: 'error' });
    }
    setLoading(false);
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assessmentForm.selectedProblems.length === 0) {
      setStatus({ message: 'Please select at least one problem.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setStatus({ message: '', type: '' });
    
    try {
      const res = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          title: assessmentForm.title,
          description: assessmentForm.description,
          timeLimitMinutes: Number(assessmentForm.timeLimitMinutes),
          xpReward: Number(assessmentForm.xpReward),
          problems: assessmentForm.selectedProblems
        })
      });

      if (res.ok) {
        setStatus({ message: 'Assessment created successfully!', type: 'success' });
        setAssessmentForm({ title: '', description: '', timeLimitMinutes: 30, xpReward: 500, selectedProblems: [] });
      } else {
        setStatus({ message: 'Failed to create assessment.', type: 'error' });
      }
    } catch (err) {
      setStatus({ message: 'Network error.', type: 'error' });
    }
    setLoading(false);
  };

  const toggleProblemSelection = (id: string) => {
    setAssessmentForm(prev => {
      const selected = prev.selectedProblems.includes(id)
        ? prev.selectedProblems.filter(p => p !== id)
        : [...prev.selectedProblems, id];
      return { ...prev, selectedProblems: selected };
    });
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/15 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Content Manager</h2>
            </div>
            <p className="text-sm text-slate-400">Manage platform content and upload new questions to the MongoDB database.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-[#111e35] p-2 rounded-xl border border-white/[0.06]">
          <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 justify-center ${activeTab === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-400 hover:text-white'}`}>
            <Code2 size={16} /> Existing Problems
          </button>
          <button onClick={() => setActiveTab('problem')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 justify-center ${activeTab === 'problem' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-400 hover:text-white'}`}>
            <Plus size={16} /> Upload Problem
          </button>
          <button onClick={() => setActiveTab('assessment')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 justify-center ${activeTab === 'assessment' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-400 hover:text-white'}`}>
            <Target size={16} /> Create Assessment
          </button>
          <button onClick={() => setActiveTab('content')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 justify-center ${activeTab === 'content' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-400 hover:text-white'}`}>
            <ServerCrash size={16} /> Learning Hub
          </button>
        </div>

        {activeTab === 'content' && (
          <ContentManager />
        )}

        {/* Content Area */}
        {activeTab !== 'content' && (
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6">
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {status.message}
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              {problems.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">No problems found in database.</div>
              ) : (
                problems.map(p => (
                  <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:border-emerald-500/30 transition-colors bg-[#0a1020]">
                    <div>
                      <h3 className="text-sm font-bold text-white">{p.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-white/[0.05]">{p.difficulty}</span>
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">{p.xp} XP</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteProblem(p._id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Problem"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'problem' && (
            <form onSubmit={handleProblemSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Problem Title</label>
                  <input required value={problemForm.title} onChange={e => setProblemForm({...problemForm, title: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" placeholder="e.g. Reverse Linked List" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Difficulty</label>
                    <select value={problemForm.difficulty} onChange={e => setProblemForm({...problemForm, difficulty: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">XP Reward</label>
                    <input type="number" required value={problemForm.xp} onChange={e => setProblemForm({...problemForm, xp: Number(e.target.value)})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tags (comma separated)</label>
                <input value={problemForm.tags} onChange={e => setProblemForm({...problemForm, tags: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" placeholder="Arrays, Hash Table, Algorithms" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description (Markdown Supported)</label>
                <textarea required rows={4} value={problemForm.description} onChange={e => setProblemForm({...problemForm, description: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50 resize-none" placeholder="Explain the problem here..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Starter Code</label>
                <textarea required rows={3} value={problemForm.starterCode} onChange={e => setProblemForm({...problemForm, starterCode: e.target.value})} className="w-full font-mono bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-emerald-300 outline-none focus:border-emerald-500/50 resize-none" placeholder="function solve(arr) { ... }" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Test Cases (JSON Format)</label>
                <textarea required rows={3} value={problemForm.testCases} onChange={e => setProblemForm({...problemForm, testCases: e.target.value})} className="w-full font-mono bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-emerald-300 outline-none focus:border-emerald-500/50 resize-none" placeholder='[{"input": "[1,2]", "expectedOutput": "3"}]' />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                  {loading ? <ServerCrash size={16} className="animate-spin" /> : <Save size={16} />} 
                  {loading ? "Uploading..." : "Save to Database"}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'assessment' && (
            <form onSubmit={handleAssessmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Assessment Title</label>
                <input required value={assessmentForm.title} onChange={e => setAssessmentForm({...assessmentForm, title: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" placeholder="e.g. Weekly DSA Challenge" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea required rows={2} value={assessmentForm.description} onChange={e => setAssessmentForm({...assessmentForm, description: e.target.value})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50 resize-none" placeholder="Explain the rules of the test..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Time Limit (Minutes)</label>
                  <input type="number" required value={assessmentForm.timeLimitMinutes} onChange={e => setAssessmentForm({...assessmentForm, timeLimitMinutes: Number(e.target.value)})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">XP Reward</label>
                  <input type="number" required value={assessmentForm.xpReward} onChange={e => setAssessmentForm({...assessmentForm, xpReward: Number(e.target.value)})} className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Select Problems for Exam</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-white/[0.06] rounded-lg p-2 bg-[#0a1020]">
                  {problems.map(p => (
                    <label key={p._id} className="flex items-center gap-3 p-2 rounded hover:bg-white/[0.04] cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={assessmentForm.selectedProblems.includes(p._id)}
                        onChange={() => toggleProblemSelection(p._id)}
                        className="accent-emerald-500"
                      />
                      <span className="text-sm text-white">{p.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.1] text-slate-400 ml-auto">{p.difficulty}</span>
                    </label>
                  ))}
                  {problems.length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-4">No problems available. Upload problems first.</div>
                  )}
                </div>
              </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> {loading ? 'Saving...' : 'Create Assessment'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
