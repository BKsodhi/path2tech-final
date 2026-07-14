import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import {
  Clock,
  CameraOff,
  Mic,
  MicOff,
  Sparkles,
  Camera,
  Eye,
  Volume2,
  Zap,
  MessageSquare,
  Send,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";

export function AiInterview() {
  const { token, user } = useAppContext();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');
  const question = searchParams.get('question');
  
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const initialAiMessage = topic && question 
    ? `Hi ${user ? user.name.split(' ')[0] : 'there'}! Let's practice some ${topic} concepts today. Can you walk me through your understanding of: "${question}"?`
    : `Hi ${user ? user.name.split(' ')[0] : 'there'}! I'm your AI interviewer today. Let's keep things relaxed. Tell me about yourself and what excites you most about software engineering.`;

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: initialAiMessage,
    },
  ]);
  const [elapsed, setElapsed] = useState(342);

  useEffect(() => {
    if (token) {
      fetch('/api/content/interviews/latest', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        setInterview(data);
        if (data && data.transcript) {
          setMessages(data.transcript);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function handleSend() {
    if (!chatInput.trim()) return;
    const newMessages = [...messages, { role: "user", text: chatInput }];
    setMessages(newMessages);
    setChatInput("");

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          messages: newMessages,
          topic: topic,
          question: question
        })
      });
      const data = await res.json();
      setMessages([...newMessages, data]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "ai", text: "Sorry, I lost connection to the server." }]);
    }
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-full flex overflow-hidden bg-[#090e1c]">
      {/* Center: Video */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Interview in Progress</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Clock size={12} className="text-slate-600" />
            {fmt(elapsed)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
              {topic ? `${topic} Screen` : (interview?.type || "SWE — Round 2")}
            </span>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 relative overflow-hidden bg-[#06090f]">
          {/* Main video placeholder */}
          <div className="absolute inset-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#0a1020] border border-white/[0.06] flex items-center justify-center">
            {camOn ? (
              <div className="flex flex-col items-center gap-3 opacity-50">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl font-extrabold text-white">
                  {user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "?"}
                </div>
                <span className="text-sm text-slate-400 font-medium">Your camera feed</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-40">
                <CameraOff size={32} className="text-slate-500" />
                <span className="text-sm text-slate-500">Camera is off</span>
              </div>
            )}

            {/* Name label */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
              {micOn
                ? <Mic size={12} className="text-emerald-400" />
                : <MicOff size={12} className="text-slate-500" />}
              <span className="text-xs font-medium text-white">{user ? user.name : "Loading..."}</span>
            </div>
          </div>

          {/* AI Interviewer pip */}
          <div className="absolute top-8 right-8 w-36 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0f2a4a] to-[#0d1627] flex flex-col items-center justify-center py-4 gap-2 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-[10px] font-bold text-cyan-300">AI Interviewer</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-cyan-400"
                  style={{ height: 8 + Math.sin(i * 1.5) * 6, animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="flex-shrink-0 flex items-center justify-center gap-3 py-4 border-t border-white/[0.06] bg-[#090e1c]">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 ${
              micOn ? "bg-[#111e35] text-slate-300 hover:bg-[#1a2d4a] border border-white/[0.06]" : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
            }`}
          >
            {micOn ? <Mic size={17} /> : <MicOff size={17} />}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 ${
              camOn ? "bg-[#111e35] text-slate-300 hover:bg-[#1a2d4a] border border-white/[0.06]" : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
            }`}
          >
            {camOn ? <Camera size={17} /> : <CameraOff size={17} />}
          </button>
          <button className="px-5 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-bold rounded-full border border-rose-500/25 transition-colors">
            End Session
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-80 flex-shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0a1020]">
        {/* Indicators */}
        <div className="px-4 py-3 border-b border-white/[0.06] space-y-2.5 flex-shrink-0">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Feedback</div>
          {[
            { label: "Eye Contact", score: interview?.feedback?.eyeContact || 0, icon: Eye, color: "text-emerald-400", bar: "bg-emerald-500" },
            { label: "Speaking Pace", score: interview?.feedback?.speakingPace || 0, icon: Volume2, color: "text-amber-400", bar: "bg-amber-500" },
            { label: "Confidence", score: interview?.feedback?.confidence || 0, icon: Zap, color: "text-cyan-400", bar: "bg-cyan-500" },
          ].map(({ label, score, icon: Icon, color, bar }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={11} className={color} />
                  <span className="text-slate-400">{label}</span>
                </div>
                <span className={`font-bold text-[11px] ${color}`}>{score}%</span>
              </div>
              <div className="h-1 bg-[#1a2d4a] rounded-full overflow-hidden">
                <div className={`h-full ${bar} rounded-full transition-all duration-700`} style={{ width: `${score}%`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Transcription */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Live Transcription</div>
          <div className="bg-[#111e35] border border-white/[0.04] rounded-xl p-3 text-xs text-slate-400 leading-relaxed max-h-20 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {interview ? "Start speaking..." : "No recent interview found."}
          </div>
        </div>

        {/* AI Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2 flex-shrink-0">
            <MessageSquare size={13} className="text-cyan-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Interviewer</span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" style={{ scrollbarWidth: "none" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Sparkles size={10} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-500/15 text-slate-200 border border-cyan-500/15 rounded-br-sm"
                      : "bg-[#111e35] text-slate-300 border border-white/[0.04] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-[#111e35] border border-white/[0.06] rounded-xl px-3 py-2 focus-within:border-cyan-500/30 transition-colors">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a response…"
                className="flex-1 text-xs text-slate-300 bg-transparent outline-none placeholder:text-slate-600"
              />
              <button
                onClick={handleSend}
                disabled={!chatInput.trim()}
                className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-700 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
