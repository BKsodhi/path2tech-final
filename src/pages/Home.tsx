import React from 'react';
import { Link } from 'react-router';
import { LayoutDashboard, ClipboardList, Target, Medal, Brain, Wrench, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Home() {
  const { user } = useAppContext();

  // Mock data for notification pills
  const notifications = {
    assignments: 3,
    assessments: 1,
    skillTest: 0,
    aptitudeTest: 2,
  };

  const cards = [
    {
      title: "Dashboard",
      description: "View your performance analytics, active streak, and personalized insights.",
      icon: <LayoutDashboard size={24} className="text-cyan-400" />,
      link: "/dashboard",
      bgClass: "from-cyan-500/10 to-blue-600/10 border-cyan-500/20",
      badge: 0
    },
    {
      title: "Assignments",
      description: "Complete your pending coursework and review past submissions.",
      icon: <ClipboardList size={24} className="text-indigo-400" />,
      link: "/assignments",
      bgClass: "from-indigo-500/10 to-purple-600/10 border-indigo-500/20",
      badge: notifications.assignments
    },
    {
      title: "Assessments",
      description: "Take formal graded tests assigned by your instructors.",
      icon: <Target size={24} className="text-emerald-400" />,
      link: "/assessments",
      bgClass: "from-emerald-500/10 to-teal-600/10 border-emerald-500/20",
      badge: notifications.assessments
    },
    {
      title: "Skill Test",
      description: "Evaluate your technical proficiency in coding and core CS concepts.",
      icon: <Medal size={24} className="text-orange-400" />,
      link: "/test-catalog",
      bgClass: "from-orange-500/10 to-red-600/10 border-orange-500/20",
      badge: notifications.skillTest
    },
    {
      title: "Aptitude Test",
      description: "Sharpen your logical reasoning, quantitative, and verbal skills.",
      icon: <Brain size={24} className="text-pink-400" />,
      link: "/aptitude-test",
      bgClass: "from-pink-500/10 to-rose-600/10 border-pink-500/20",
      badge: notifications.aptitudeTest
    },
    {
      title: "Do It Yourself (DIY)",
      description: "Practice independently with AI Interviews and Resume Studios.",
      icon: <Wrench size={24} className="text-violet-400" />,
      link: "/diy",
      bgClass: "from-violet-500/10 to-fuchsia-600/10 border-violet-500/20",
      badge: 0
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-[#090e1c]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to Path2Tech, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.name?.split(' ')[0] || 'Student'}!</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base max-w-2xl">
            Your centralized Learning Management System. Access your assignments, track your progress, and prepare for your dream career.
          </p>
        </div>

        {/* 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${card.bgClass} border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 group`}
            >
              {/* Notification Pill */}
              {card.badge > 0 && (
                <div className="absolute -top-3 -right-3 h-7 min-w-[28px] px-2 rounded-full bg-red-500 border-2 border-[#090e1c] flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
                  {card.badge} pending
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center mb-4 border border-white/5 group-hover:bg-black/30 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link 
                  to={card.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors"
                >
                  Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
