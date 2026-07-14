import React, { useState } from 'react';
import { Loader2, FileText, Briefcase, Zap, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function AtsMatcher() {
  const { token } = useAppContext();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both your resume and the job description.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/resume/ats-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for metric color
  const getMetricColor = (percentage: number) => {
    if (percentage >= 75) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (percentage >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getIcon = (percentage: number) => {
    if (percentage >= 75) return <CheckCircle2 className="text-emerald-400" size={24} />;
    if (percentage >= 50) return <AlertTriangle className="text-amber-400" size={24} />;
    return <AlertCircle className="text-rose-400" size={24} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Left Column: Inputs */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <FileText className="text-violet-400" size={18} /> Current Resume
          </h2>
          <textarea 
            className="w-full h-48 bg-[#0a1020] border border-white/[0.08] rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition-colors resize-none placeholder-slate-600"
            placeholder="Paste your current resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Briefcase className="text-cyan-400" size={18} /> Job Description
          </h2>
          <textarea 
            className="w-full h-48 bg-[#0a1020] border border-white/[0.08] rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-cyan-500/50 transition-colors resize-none placeholder-slate-600"
            placeholder="Paste the target Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Analyzing ATS Match...
            </>
          ) : (
            <>
              <Zap size={18} /> Analyze ATS Match
            </>
          )}
        </button>
        
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl font-medium flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Right Column: Analysis Dashboard */}
      <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[600px]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Zap className="text-amber-400" size={18} /> Analysis Dashboard
        </h2>

        {!result && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Briefcase size={48} className="mb-4 opacity-30" />
            <p className="font-medium">Paste your details and click Analyze</p>
            <p className="text-xs mt-1">Our AI will scan for missing keywords and rank your ATS score.</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-violet-400">
            <Loader2 size={48} className="animate-spin mb-4 opacity-80" />
            <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Running AI Analysis...</p>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-8 flex-1 animate-in fade-in duration-500">
            
            {/* Metric Circle */}
            <div className="flex flex-col items-center text-center">
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-4 ${getMetricColor(result.matchPercentage)}`}>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{result.matchPercentage}</span>
                  <span className="text-xl pb-1 font-bold opacity-80">%</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg flex items-center justify-center gap-2">
                {getIcon(result.matchPercentage)}
                {result.matchPercentage >= 75 ? 'Strong Candidate Match' : result.matchPercentage >= 50 ? 'Moderate Match' : 'Weak Candidate Match'}
              </h3>
            </div>

            {/* Missing Keywords */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Missing ATS Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords && result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((keyword: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-lg shadow-sm">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg shadow-sm">
                    No major keywords missing!
                  </span>
                )}
              </div>
            </div>

            {/* Actionable Feedback */}
            <div className="bg-[#0a1020] border border-white/[0.08] rounded-xl p-5 shadow-inner flex-1">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles size={14} /> AI Optimization Feedback
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {result.actionableFeedback}
              </p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
