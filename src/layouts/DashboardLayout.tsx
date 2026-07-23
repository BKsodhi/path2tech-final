import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Zap,
  LayoutDashboard,
  Code2,
  Video,
  FileText,
  ChevronRight,
  BookOpen,
  BarChart3,
  Flame,
  Bell,
  BrainCircuit,
  Target,
  PenTool,
  Settings,
  LogOut,
  Calendar,
  Trophy,
  Home,
  ClipboardList,
  Library,
  Wrench,
  Brain,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { streak, user, setToken } = useAppContext();

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  };

  const NavItem = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
          active
            ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
      >
        <span className={active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}>
          {icon}
        </span>
        <span>{label}</span>
        {active && <ChevronRight size={13} className="ml-auto text-cyan-500" />}
      </Link>
    );
  };

  // Helper to map route path to header title
  const getHeaderTitle = () => {
    if (location.pathname.startsWith("/home")) return "Welcome to Path2Tech";
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/assignments")) return "Assignments";
    if (location.pathname.startsWith("/test-catalog")) return "Test Catalog";
    if (location.pathname.startsWith("/diy/interviews")) return "AI Interviews";
    if (location.pathname.startsWith("/diy")) return "Do It Yourself";
    if (location.pathname.startsWith("/aptitude-test")) return "Aptitude Test";
    if (location.pathname.startsWith("/settings")) return "Settings";
    if (location.pathname.startsWith("/learning-hub")) return "Learning Hub";
    if (location.pathname.startsWith("/topic")) return "Topic Detail";
    if (location.pathname.startsWith("/coding")) return "Practice";
    if (location.pathname.startsWith("/assessments")) return "Assessments";
    if (location.pathname.startsWith("/resume")) return "Resume Studio";
    if (location.pathname.startsWith("/interview")) return "AI Interview";
    if (location.pathname.startsWith("/analytics")) return "Analytics";
    if (location.pathname.startsWith("/leaderboard")) return "Leaderboard";
    return "Path2Tech";
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0d1627] text-slate-200"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-[#090e1c] border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">Path2Tech</span>
          </Link>
        </div>

        {/* User greeting */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{user ? user.name : "Loading..."}</div>
              <div className="text-xs text-slate-500">Software Engineer</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">Main Menu</div>
          <div className="space-y-1">
            <NavItem icon={<Home size={16} />} label="Student Home" to="/home" />
            <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" to="/dashboard" />
            <NavItem icon={<ClipboardList size={16} />} label="Assignments" to="/assignments" />
            <NavItem icon={<Library size={16} />} label="Test Catalog" to="/test-catalog" />
            <NavItem icon={<Brain size={16} />} label="Aptitude Test" to="/aptitude-test" />
            <NavItem icon={<Wrench size={16} />} label="DIY" to="/diy" />
            
            {/* Legacy Links */}
            <NavItem icon={<BookOpen size={16} />} label="Learning Hub" to="/learning-hub" />
            <NavItem icon={<Target size={16} />} label="Assessments" to="/assessments" />
          </div>

          <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mt-4 mb-2">Resources</div>
          <div className="space-y-1">
            <NavItem icon={<Trophy size={16} />} label="Leaderboard" to="/leaderboard" />
            <NavItem icon={<Calendar size={16} />} label="Calendar" to="/calendar" />
            <NavItem icon={<Target size={16} />} label="Achievements" to="/achievements" />
            <NavItem icon={<Bell size={16} />} label="Notifications" to="/notifications" />
            <NavItem icon={<Settings size={16} />} label="Settings" to="/settings" />
            {user?.role === 'admin' && (
              <NavItem icon={<Settings size={16} />} label="Admin Panel" to="/admin" />
            )}
          </div>
        </nav>

        {/* Streak widget */}
        <div className="px-3 pb-3">
          <div className="bg-gradient-to-br from-orange-500/15 to-amber-600/5 border border-orange-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">Daily Streak</span>
            </div>
            <div className="text-2xl font-extrabold text-white leading-none">{streak} <span className="text-sm font-semibold text-orange-300">days</span></div>
            <div className="text-[11px] text-slate-500 mt-1">You're on fire! Don't break it 🔥</div>
          </div>
        </div>
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-13 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0d1627]/90 backdrop-blur-md" style={{ height: 52 }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {getHeaderTitle()}
            </span>
            {location.pathname === "/coding" && (
              <span className="ml-2 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                Medium
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 cursor-pointer hover:bg-orange-500/15 transition-colors">
              <Flame size={13} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-300">{streak}</span>
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-200 rounded-lg hover:bg-white/[0.06] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full ring-1 ring-[#0d1627]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-white/10 cursor-pointer">
              {user ? getInitials(user.name) : "?"}
            </div>
            <button onClick={handleLogout} className="relative w-8 h-8 flex items-center justify-center text-rose-400/70 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors ml-2" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Screen */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
