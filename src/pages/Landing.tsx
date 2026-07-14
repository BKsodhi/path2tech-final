import React from "react";
import { Link } from "react-router";
import { Zap, Code2, Target, Trophy, ArrowRight, CheckCircle, BarChart2, Video } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0d1627] text-slate-200 overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] bg-[#0d1627]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">Path2Tech</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-cyan-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold">
            <SparklesIcon /> The Ultimate Career Readiness Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Prep. Track. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Succeed.</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything you need to land your dream job in one intelligent platform. Master coding, optimize your resume for ATS, and ace your interviews with AI.
          </p>
          
          <div className="flex items-center gap-4">
            <Link to="/register" className="flex items-center gap-2 bg-white text-[#0d1627] hover:bg-slate-200 text-base font-bold px-8 py-4 rounded-xl transition-all duration-150 shadow-lg shadow-white/10">
              Start Learning for Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#0a1020] border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Your Complete Placement Companion</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Replace multiple generic tools with one unified, AI-powered platform designed specifically for placement preparation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Code2 className="text-cyan-400" size={24} />}
              color="from-cyan-500/20 to-transparent"
              title="Coding Arena"
              desc="Practice DSA with AI hints instead of toxic leaderboards. Focus on your personal growth and streaks."
            />
            <FeatureCard 
              icon={<Video className="text-violet-400" size={24} />}
              color="from-violet-500/20 to-transparent"
              title="AI Mock Interviews"
              desc="Practice technical and behavioral interviews with a realistic AI interviewer that gives actionable feedback."
            />
            <FeatureCard 
              icon={<Target className="text-emerald-400" size={24} />}
              color="from-emerald-500/20 to-transparent"
              title="ATS Resume Analyzer"
              desc="Optimize your resume for applicant tracking systems. Find missing keywords and perfect your formatting."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-white">Path2Tech</span>
        </div>
        <p>© 2026 Path2Tech Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.15] transition-all group">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
