import React, { useState, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, Loader2, AlertCircle, Target, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function VocalMcqModule({ subject, items, progress }: { subject: string, items: any[], progress: any }) {
  const { token } = useAppContext();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const recognitionRef = useRef<any>(null);

  const activeItem = items[activeItemIndex];

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onstart = () => setIsRecording(true);
    
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) finalTranscript += event.results[i][0].transcript;
      setTranscript(finalTranscript);
    };
    recognitionRef.current.onerror = () => setIsRecording(false);
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      evaluateResponse();
    }
  };

  const evaluateResponse = async () => {
    if (!transcript.trim()) return;
    setEvaluating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/learning-hub/eval-vocal-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify({
          transcript,
          expectedKeywords: activeItem.contentPayload.expectedKeywords || [],
          itemType: 'mcq',
          itemId: activeItem._id,
          subject
        })
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) { console.error(err); }
    setEvaluating(false);
  };

  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-[#111e35] rounded-2xl border border-white/[0.05]">
        <Target size={48} className="mb-4 opacity-50 text-cyan-500" />
        <p className="font-semibold text-lg text-slate-300">No MCQs available.</p>
        <p className="text-sm">Check back soon for new content.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">
      
      {/* Question Header Progress Bar */}
      <div className="flex items-center justify-between mb-6 bg-[#111e35] p-4 rounded-xl border border-white/[0.06] shadow-sm">
        <div className="flex gap-1.5 flex-1 max-w-sm">
          {items.map((item, idx) => (
            <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx === activeItemIndex ? 'bg-cyan-400' : 
              progress?.completedItems?.includes(item._id) ? 'bg-emerald-500/50' : 'bg-[#0a1020] border border-white/[0.05]'
            }`} />
          ))}
        </div>
        <div className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20 uppercase tracking-widest flex items-center gap-1.5">
          <Target size={12} /> Q {activeItemIndex + 1} of {items.length}
        </div>
      </div>

      {/* Main MCQ Card */}
      <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col shadow-lg">
        
        <h2 className="text-xl font-bold text-white mb-8 leading-snug">{activeItem.contentPayload.question}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {activeItem.contentPayload.options.map((opt: string, i: number) => {
            const letters = ['A', 'B', 'C', 'D'];
            return (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-[#0a1020] text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  {letters[i]}
                </div>
                <div className="text-sm font-medium leading-relaxed">{opt}</div>
              </div>
            );
          })}
        </div>

        {/* Voice Trigger - Centered */}
        <div className="bg-[#0a1020] border border-white/[0.04] p-6 rounded-xl flex flex-col items-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Mic size={14} className="text-cyan-400 animate-pulse" /> State your answer out loud (e.g. "Option A")
          </div>
          
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105 ring-4 ring-rose-500/20' 
                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20'
            }`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          {transcript && (
             <div className="mt-4 text-sm text-cyan-100 font-medium bg-cyan-900/30 px-4 py-2 rounded-lg border border-cyan-500/20 flex items-center gap-2">
               <span className="text-cyan-400">"</span>{transcript}<span className="text-cyan-400">"</span>
             </div>
          )}
        </div>

        {/* Feedback Overlays */}
        {evaluating && (
          <div className="absolute inset-0 bg-[#111e35]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl">
            <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
            <div className="text-sm font-bold text-cyan-400 tracking-widest uppercase">Validating Logic...</div>
          </div>
        )}

        {feedback && !evaluating && (
          <div className="absolute inset-0 bg-[#0a1020]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-20 text-center rounded-2xl">
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              feedback.passing 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {feedback.passing ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
            </div>
            
            <h3 className={`text-2xl font-bold mb-3 ${feedback.passing ? 'text-emerald-400' : 'text-rose-400'}`}>
              {feedback.passing ? 'Correct Answer!' : 'Not quite right'}
            </h3>
            
            <p className="text-slate-300 text-sm mb-8 max-w-sm leading-relaxed">
              {feedback.encouragingFeedback}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setFeedback(null); setTranscript(''); }}
                className="px-6 py-2.5 rounded-lg border border-white/[0.1] text-xs font-bold text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all"
              >
                Try Again
              </button>
              {activeItemIndex < items.length - 1 && feedback.passing && (
                <button 
                  onClick={() => { setActiveItemIndex(prev => prev + 1); setFeedback(null); setTranscript(''); }}
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 group"
                >
                  Next Question <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
