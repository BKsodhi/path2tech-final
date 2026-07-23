import React, { useState } from 'react';
import { Bell, Smartphone, Lock, Trash2, ChevronRight } from 'lucide-react';

export function Settings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences and configurations.</p>
        </div>

        {/* Section 1: Notifications */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Notifications</h2>
          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl overflow-hidden shadow-lg">
            
            {/* Email Notifs Row */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Bell size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Email Notifications</h3>
                  <p className="text-xs text-slate-400">Receive daily summaries and assignment alerts via email.</p>
                </div>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailNotifs ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            {/* Push Notifs Row */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Smartphone size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Push Notifications</h3>
                  <p className="text-xs text-slate-400">Receive instant alerts on your mobile device.</p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`w-12 h-6 rounded-full transition-colors relative ${pushNotifs ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${pushNotifs ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

          </div>
        </section>

        {/* Section 2: Security */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Security</h2>
          <div className="bg-[#0d1627] border border-white/[0.06] rounded-2xl overflow-hidden shadow-lg">
            <button className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Lock size={20} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">Change Password</h3>
                  <p className="text-xs text-slate-400">Update your account password for enhanced security.</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </section>

        {/* Section 3: Danger Zone */}
        <section>
          <h2 className="text-sm font-semibold text-red-500/80 uppercase tracking-widest mb-4">Danger Zone</h2>
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden shadow-lg">
            <button className="w-full flex items-center justify-between p-5 hover:bg-red-500/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-red-400 group-hover:text-red-300 transition-colors">Delete Account</h3>
                  <p className="text-xs text-red-500/70">Permanently delete your account and all associated data.</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-red-500/50 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
