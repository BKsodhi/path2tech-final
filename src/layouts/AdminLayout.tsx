import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { 
  Zap, 
  ShieldCheck, 
  Database,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setToken } = useAppContext();
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'A';
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const NavItem = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
          active
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
      >
        <span className={active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}>
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1627] text-white flex-col gap-4">
        <ShieldCheck size={64} className="text-rose-500" />
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <Link to="/dashboard" className="px-6 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm font-semibold transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0d1627] text-slate-200"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-[#090e1c] border-r border-emerald-500/10 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">Admin Console</span>
          </Link>
        </div>

        {/* Admin greeting */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-emerald-500/20">
              {user ? getInitials(user.name) : "AD"}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-white leading-tight truncate">{user ? user.name : "Admin"}</div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Super Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest px-2 mb-2">Platform Management</div>
          <div className="space-y-1">
            <NavItem icon={<LayoutDashboard size={16} />} label="Overview" to="/admin" />
            <NavItem icon={<Database size={16} />} label="Content Manager" to="/admin/content" />
            <NavItem icon={<Users size={16} />} label="Users (Coming Soon)" to="/admin/users" />
            <NavItem icon={<Settings size={16} />} label="Settings" to="/admin/settings" />
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <Link 
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
          >
            <ExternalLink size={16} /> Switch to Student App
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-150"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="h-13 flex-shrink-0 flex items-center justify-between px-6 border-b border-emerald-500/10 bg-[#0a1020]" style={{ height: 52 }}>
          <div className="flex items-center gap-2 text-emerald-500/50">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Secure Connection</span>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[#090e1c] to-[#0d1627] relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
