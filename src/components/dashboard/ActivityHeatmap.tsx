import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

// Generate 90 days of mock activity data
interface ActivityDay {
  date: string;
  count: number;
  displayDate: string;
}

const generateMockData = (): ActivityDay[] => {
  const data: ActivityDay[] = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Randomize activity for visual testing (mostly 0s and 1s, occasional 5s)
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 6) : 0;
    data.push({ 
      date: date.toISOString().split('T')[0], 
      count,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return data;
};

export function ActivityHeatmap() {
  const heatmapData = useMemo(() => generateMockData(), []);

  // Calculate intensity color
  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#1e293b] border-white/[0.02]'; // empty/gray
    if (count === 1 || count === 2) return 'bg-emerald-900/50 border-emerald-800/50'; // very light
    if (count === 3 || count === 4) return 'bg-emerald-600 border-emerald-500'; // medium
    return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]'; // neon/dark green
  };

  // Group into weeks for the grid (assuming 7 days per column)
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];
  
  heatmapData.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="text-emerald-400" size={18} /> Consistency Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">Your coding and learning activity over the last 90 days.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#1e293b] border border-white/[0.02]"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-900/50 border border-emerald-800/50"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-4 custom-scrollbar">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1.5">
            {week.map((day: ActivityDay, dayIndex: number) => (
              <div 
                key={dayIndex} 
                className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 group relative ${getColor(day.count)} cursor-pointer hover:ring-2 hover:ring-white/20 hover:z-10`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-white/10">
                  {day.displayDate}: {day.count} {day.count === 1 ? 'Challenge' : 'Challenges'} Completed
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
