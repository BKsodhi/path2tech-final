import React from 'react';
import { Settings, Shield, Bell, Key } from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center">
            <Settings size={20} className="text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Platform Settings</h1>
            <p className="text-slate-400 text-sm">Configure global platform behavior and security.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Security & Access</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a1020] border border-white/[0.04]">
                <div>
                  <div className="text-sm font-semibold text-white">Allow Public Registration</div>
                  <div className="text-xs text-slate-500">Enable new users to sign up automatically</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a1020] border border-white/[0.04]">
                <div>
                  <div className="text-sm font-semibold text-white">Require Email Verification</div>
                  <div className="text-xs text-slate-500">Users must verify their email to log in</div>
                </div>
                <input type="checkbox" className="accent-emerald-500 w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key size={18} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">API Keys</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Google Gemini API Key</label>
                <input type="password" value="********************************" readOnly className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-slate-500 outline-none" />
                <p className="text-[10px] text-slate-500 mt-1">Configured securely via environment variables (.env)</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">MongoDB URI</label>
                <input type="password" value="mongodb+srv://..." readOnly className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-slate-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-blue-400" />
              <h2 className="text-lg font-bold text-white">Global Notifications</h2>
            </div>
            <div className="space-y-4">
              <textarea 
                rows={3} 
                className="w-full bg-[#0a1020] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 resize-none" 
                placeholder="Broadcast a message to all users on the platform..."
              />
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
