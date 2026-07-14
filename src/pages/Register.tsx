import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Zap, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function Register() {
  const navigate = useNavigate();
  const { setToken } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Is the backend running?");
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }
      
      setToken(data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1627] text-slate-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create an account</h1>
          <p className="text-slate-400 mt-2 text-sm text-center">Start your journey to becoming placement-ready today.</p>
        </div>

        <div className="bg-[#111e35]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
          {error && <div className="mb-4 text-xs font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a1020] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Arjun Rathi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a1020] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a1020] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold py-3 rounded-xl transition-all duration-150 shadow-md shadow-cyan-500/20 mt-6"
            >
              Sign Up <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-white/[0.06]"></div>
            <span className="px-3 text-xs text-slate-500">OR</span>
            <div className="flex-1 border-t border-white/[0.06]"></div>
          </div>

          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0a1020] hover:bg-white/[0.04] border border-white/[0.06] text-slate-300 text-sm font-semibold py-3 rounded-xl transition-colors">
            <Github size={18} /> Sign up with GitHub
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-white hover:text-cyan-400 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
