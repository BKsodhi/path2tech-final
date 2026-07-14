import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Clock, ChevronRight, CheckCircle2, ChevronLeft, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function AssessmentRunner() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAppContext();
  
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (token && assessmentId) {
      fetch(`/api/assessments/${assessmentId}`, {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.json())
        .then(data => {
          setAssessment(data);
          setTimeLeft(data.timeLimitMinutes * 60);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token, assessmentId]);

  useEffect(() => {
    if (!loading && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !loading && !submitted) {
      handleSubmit();
    }
  }, [loading, submitted, timeLeft]);

  const handleSubmit = () => {
    setSubmitted(true);
    // In a full version, we'd grade their answers here.
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="h-full flex items-center justify-center text-slate-400">Loading Assessment...</div>;
  if (!assessment) return <div className="h-full flex items-center justify-center text-slate-400">Assessment not found.</div>;

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Assessment Complete!</h2>
        <p className="text-slate-400 max-w-md">Your answers have been submitted for evaluation. You will receive a notification with your results and earned XP shortly.</p>
        <button 
          onClick={() => navigate('/assessments')}
          className="mt-6 px-6 py-2.5 bg-[#111e35] hover:bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-semibold text-white transition-colors"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const currentProblem = assessment.problems[currentIndex];

  return (
    <div className="h-full flex flex-col bg-[#080d19]">
      {/* Top Bar */}
      <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#0d1627]">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-violet-400" />
          <span className="text-sm font-bold text-white">{assessment.title}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <Clock size={14} className="text-rose-400" />
            <span className="text-sm font-bold text-rose-400 font-mono">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Problem List */}
        <div className="w-64 border-r border-white/[0.06] bg-[#0d1627] flex flex-col">
          <div className="p-4 border-b border-white/[0.06] text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Questions ({assessment.problems.length})
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {assessment.problems.map((p: any, i: number) => (
              <button
                key={p._id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  currentIndex === i 
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/30" 
                  : "text-slate-400 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="font-semibold mb-0.5">Question {i + 1}</div>
                <div className="text-[10px] truncate opacity-70">{p.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Current Problem / Runner */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{currentProblem?.title}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/[0.05] text-slate-300">
                {currentProblem?.difficulty}
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-300 mb-8 whitespace-pre-wrap text-sm leading-relaxed">
              {currentProblem?.description}
            </div>

            <div className="bg-[#111e35] border border-white/[0.06] rounded-xl p-4">
              <div className="text-sm font-semibold text-slate-400 mb-2">Your Answer / Code:</div>
              <textarea 
                className="w-full h-48 bg-[#0a1020] border border-white/[0.06] rounded-lg p-4 text-sm text-slate-300 font-mono outline-none focus:border-violet-500/50 resize-none"
                placeholder="// Write your solution here..."
                defaultValue={currentProblem?.starterCode}
              />
            </div>
          </div>
          
          {/* Bottom Bar: Prev / Next */}
          <div className="h-16 flex-shrink-0 border-t border-white/[0.06] bg-[#0d1627] flex items-center justify-between px-8">
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="text-xs text-slate-500 font-semibold">{currentIndex + 1} of {assessment.problems.length}</div>
            <button 
              onClick={() => setCurrentIndex(Math.min(assessment.problems.length - 1, currentIndex + 1))}
              disabled={currentIndex === assessment.problems.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-white transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
