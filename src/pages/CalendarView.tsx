import React from 'react';
import { Calendar as CalendarIcon, CheckCircle, Circle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function CalendarView() {
  const { streak } = useAppContext();
  
  // Generate a mock 30 day calendar
  const days = Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    completed: i < streak, // Simulate streak completion
    isToday: i === streak
  }));

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-4xl space-y-6">
        <div className="bg-gradient-to-r from-orange-600/15 to-rose-600/10 border border-orange-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Study Calendar</h2>
            <p className="text-sm text-slate-400">Track your daily coding habits. Consistency is the key to mastery.</p>
          </div>
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <CalendarIcon size={24} className="text-orange-400" />
          </div>
        </div>

        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-6">Current Streak: <span className="text-orange-400">{streak} Days</span></h3>
          
          <div className="grid grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 mb-2">{d}</div>
            ))}
            
            {days.map((day, i) => (
              <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative ${
                day.completed ? "bg-orange-500/15 border border-orange-500/30 text-orange-400" 
                : day.isToday ? "bg-white/[0.05] border border-white/20 text-white"
                : "bg-black/20 border border-white/[0.03] text-slate-600"
              }`}>
                <span className="text-sm font-bold">{day.date}</span>
                {day.completed && <CheckCircle size={12} className="absolute bottom-1.5 right-1.5 opacity-50" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
