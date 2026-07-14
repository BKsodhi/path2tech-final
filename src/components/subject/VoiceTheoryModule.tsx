import React, { useState, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, Play, Volume2, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function VoiceTheoryModule({ subject, items, progress }: { subject: string, items: any[], progress: any }) {
  const { token } = useAppContext();
  const [activeItem, setActiveItem] = useState<any>(items[0] || null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support the Web Speech API. Please use Google Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => setIsRecording(true);
    
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

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
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          transcript,
          expectedKeywords: activeItem.contentPayload.expectedKeywords || [],
          itemType: activeItem.type,
          itemId: activeItem._id,
          subject
        })
      });
      
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
    }
    setEvaluating(false);
  };

  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-[#111e35] rounded-2xl border border-white/[0.05]">
        <BrainCircuit size={48} className="mb-4 opacity-50" />
        <p className="font-semibold text-lg">No theory modules available.</p>
        <p className="text-sm">Check back soon for new content.</p>
      </div>
    );
  }

  const isCompleted = progress?.completedItems?.includes(activeItem._id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      {/* Sidebar selection */}
      <div className="lg:col-span-1 space-y-3">
        {items.map(item => (
          <button
            key={item._id}
            onClick={() => { setActiveItem(item); setTranscript(''); setFeedback(null); }}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
              activeItem._id === item._id 
                ? 'bg-violet-500/10 border-violet-500/30' 
                : 'bg-[#111e35] border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.03]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="pr-2">
                <div className={`text-sm font-bold mb-1 ${activeItem._id === item._id ? 'text-violet-400' : 'text-slate-200'}`}>
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">{item.contentPayload.question}</div>
              </div>
              {progress?.completedItems?.includes(item._id) && (
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Main Interaction Area */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Question Card */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          {isCompleted && (
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-bl-xl border-b border-l border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Mastered
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <Volume2 size={18} className="text-violet-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">AI Viva Prompt</span>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-3">{activeItem.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{activeItem.contentPayload.question}</p>
        </div>

        {/* Voice Interface */}
        <div className="bg-[#0a1020] border border-white/[0.06] rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center relative">
          
          <div className="mb-8 w-full max-w-lg">
            <div className="bg-[#111e35] border border-white/[0.06] rounded-xl p-6 min-h-[120px] relative transition-all duration-300 flex items-center justify-center text-center">
              {!transcript && !isRecording && (
                <div className="text-slate-500 flex flex-col items-center">
                  <Mic size={20} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium italic">Press and hold the microphone below to dictate your answer...</span>
                </div>
              )}
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {transcript}
                {isRecording && <span className="inline-block w-2 h-4 bg-violet-500 ml-1.5 animate-pulse rounded-sm align-middle" />}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording 
                  ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] scale-105 ring-4 ring-rose-500/20' 
                  : 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20'
              }`}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              isRecording 
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20 animate-pulse' 
                : 'text-slate-500 bg-white/[0.03] border border-white/[0.05]'
            }`}>
              {isRecording ? 'Listening...' : 'Hold to Speak'}
            </span>
          </div>

          {/* Evaluation Feedback */}
          {evaluating && (
            <div className="absolute inset-0 bg-[#0a1020]/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
              <Loader2 size={32} className="text-violet-500 animate-spin mb-4" />
              <div className="text-sm font-bold text-violet-400 uppercase tracking-widest animate-pulse">Evaluating Response...</div>
            </div>
          )}

          {feedback && !evaluating && (
            <div className={`absolute inset-x-4 bottom-4 p-5 rounded-xl border flex items-start gap-4 backdrop-blur-md z-20 shadow-xl ${
              feedback.passing 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                feedback.passing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {feedback.passing ? <Sparkles size={20} /> : <Volume2 size={20} />}
              </div>
              <div>
                <div className={`text-sm font-bold mb-1 flex items-center gap-2 ${feedback.passing ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {feedback.passing ? 'Concept Mastered!' : 'Almost There!'}
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    feedback.passing ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-amber-500/20 border-amber-500/30'
                  }`}>
                    Score: {feedback.score}/100
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-medium">{feedback.encouragingFeedback}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
