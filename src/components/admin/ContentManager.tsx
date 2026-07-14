import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, BookOpen, Mic, Code2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function ContentManager() {
  const { token } = useAppContext();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Data Structures',
    type: 'theory',
    title: '',
    contentPayload: ''
  });

  useEffect(() => {
    fetchContent();
  }, [token]);

  const fetchContent = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/content', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '' }
      });
      if (res.ok) {
        setContent(content.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(formData.contentPayload || '{}');
      } catch {
        alert('Invalid JSON in Content Payload');
        return;
      }

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          subject: formData.subject,
          type: formData.type,
          title: formData.title,
          contentPayload: parsedPayload
        })
      });

      if (res.ok) {
        setShowModal(false);
        fetchContent();
        setFormData({ subject: 'Data Structures', type: 'theory', title: '', contentPayload: '' });
      } else {
        alert('Failed to save content');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'theory') return <BookOpen size={14} className="text-violet-400" />;
    if (type === 'mcq') return <Mic size={14} className="text-amber-400" />;
    return <Code2 size={14} className="text-emerald-400" />;
  };

  return (
    <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Learning Hub Content</h2>
          <p className="text-xs text-slate-400 mt-1">Manage theory prompts, vocal MCQs, and interactive coding challenges.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={14} /> Add Content
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-[#0a1020] text-slate-500 border-b border-white/[0.04]">
            <tr>
              <th className="px-4 py-3 font-bold rounded-tl-lg">Title</th>
              <th className="px-4 py-3 font-bold">Subject</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">Loading content...</td></tr>
            ) : content.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No content items found.</td></tr>
            ) : (
              content.map((item) => (
                <tr key={item._id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">{item.title}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-300 border border-white/[0.05]">{item.subject}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                      {getTypeIcon(item.type)} {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="text-rose-400 hover:text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 p-1.5 rounded transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111e35] border border-white/[0.1] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Content</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#0a1020] border border-white/[0.08] rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-500/50 outline-none"
                  >
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>DBMS</option>
                    <option>Operating Systems</option>
                    <option>Computer Networks</option>
                    <option>OOPs</option>
                    <option>System Design</option>
                    <option>Web Development</option>
                    <option>Machine Learning</option>
                    <option>Cloud Computing</option>
                    <option>Cybersecurity</option>
                    <option>Computer Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#0a1020] border border-white/[0.08] rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-500/50 outline-none"
                  >
                    <option value="theory">Theory (Voice)</option>
                    <option value="mcq">MCQ (Vocal)</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0a1020] border border-white/[0.08] rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g. Explain Arrays vs Linked Lists"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Content Payload (JSON)</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.contentPayload}
                  onChange={e => setFormData({...formData, contentPayload: e.target.value})}
                  className="w-full font-mono text-xs bg-[#0a1020] border border-white/[0.08] rounded-lg p-3 text-slate-300 focus:border-cyan-500/50 outline-none resize-none"
                  placeholder='{\n  "questionText": "...",\n  "expectedKeywords": []\n}'
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <Save size={14} /> Save Content
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
