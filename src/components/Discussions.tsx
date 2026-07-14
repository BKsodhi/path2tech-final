import React, { useEffect, useState } from 'react';
import { MessageSquare, ArrowBigUp, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Discussions({ problemId }: { problemId: string }) {
  const { token, user } = useAppContext();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && problemId) {
      fetchComments();
    }
  }, [token, problemId]);

  const fetchComments = () => {
    fetch(`/api/comments/problem/${problemId}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handlePost = () => {
    if (!newComment.trim() || !token) return;

    fetch(`/api/comments/problem/${problemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ text: newComment })
    })
      .then(res => res.json())
      .then(data => {
        setComments([data, ...comments]);
        setNewComment("");
      })
      .catch(err => console.error(err));
  };

  const handleUpvote = (id: string) => {
    if (!token) return;
    fetch(`/api/comments/${id}/upvote`, {
      method: 'PUT',
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(() => {
        setComments(comments.map(c => c._id === id ? { ...c, upvotes: c.upvotes + 1 } : c));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div className="text-slate-500 text-sm p-4">Loading discussions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your approach or ask a question..."
          className="flex-1 bg-[#111e35] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
        />
        <button
          onClick={handlePost}
          className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-colors"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c._id} className="bg-[#111e35] border border-white/[0.06] rounded-xl p-4 flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleUpvote(c._id)}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
              >
                <ArrowBigUp size={20} />
              </button>
              <span className="text-xs font-bold text-slate-400">{c.upvotes}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-white">{c.user?.name || "Unknown User"}</span>
                <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{c.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-8">No discussions yet. Be the first to start one!</div>
        )}
      </div>
    </div>
  );
}
