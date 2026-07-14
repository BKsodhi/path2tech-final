import React, { useEffect, useState } from 'react';
import { Users, Flame, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function AdminUsers() {
  const { token } = useAppContext();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/admin/users', {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.json())
        .then(data => {
          setUsers(data);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }, [token]);

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-400">Loading Users...</div>;
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Users size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
            <p className="text-slate-400 text-sm">View all registered students on the platform.</p>
          </div>
        </div>

        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-[#0a1020] text-xs uppercase font-semibold text-slate-500 border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">XP Score</th>
                  <th className="px-6 py-4">Streak</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        user.role === 'admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Star size={14} /> {user.careerScore || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame size={14} /> {user.streak || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
