import React, { useState } from 'react';
import { Play, Loader2, Lightbulb, TerminalSquare, Braces, Sparkles, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Editor from '@monaco-editor/react';

const languageBoilerplates: any = {
  javascript: "// JavaScript Node.js\nfunction solve(input) {\n  // Type your code here\n  console.log('Result');\n}\n\nsolve();",
  python: "# Python 3\ndef solve(input):\n    # Type your code here\n    print('Result')\n\nsolve(None)",
  java: "// Java\npublic class Main {\n    public static void main(String[] args) {\n        // Type your code here\n        System.out.println(\"Result\");\n    }\n}",
  cpp: "// C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Type your code here\n    cout << \"Result\" << endl;\n    return 0;\n}"
};

export function InteractiveCodingArena({ subject, items, progress }: { subject: string, items: any[], progress: any }) {
  const { token } = useAppContext();
  const [activeItem, setActiveItem] = useState<any>(items[0] || null);
  const [code, setCode] = useState(activeItem?.contentPayload?.starterCode || '// Write your code here');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-[#111e35] rounded-2xl border border-white/[0.05]">
        <Braces size={48} className="mb-4 opacity-50 text-emerald-500" />
        <p className="font-semibold text-lg text-slate-300">No coding challenges available.</p>
        <p className="text-sm">Check back soon for new content.</p>
      </div>
    );
  }

  const runCode = async () => {
    setRunning(true);
    setOutput('Initiating secure sandbox execution...\n');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify({ code, language, problemId: activeItem._id })
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.execution?.output || data.message || 'Execution completed successfully.');
      } else {
        setOutput(`Execution Error:\n${data.message || 'Failed to compile'}`);
      }
    } catch (err: any) {
      setOutput(`System Error:\n${err.message}`);
    }
    setRunning(false);
  };

  const requestHint = async () => {
    setHintLoading(true);
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify({ code, problemTitle: activeItem.title, problemDescription: activeItem.contentPayload.question })
      });
      const data = await res.json();
      setHint(data.hint);
    } catch (err) {
      console.error(err);
    }
    setHintLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      {/* Problem Description - Left Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Selector */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-xl p-4">
          <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Active Challenge</label>
          <div className="relative">
            <select 
              value={activeItem._id}
              onChange={(e) => {
                const item = items.find(i => i._id === e.target.value);
                setActiveItem(item);
                setCode(item.contentPayload.starterCode || '');
                setOutput('');
                setHint('');
              }}
              className="appearance-none bg-[#0a1020] border border-white/[0.08] rounded-lg px-3 py-2 text-sm font-semibold text-white outline-none w-full focus:border-emerald-500/50 transition-colors cursor-pointer"
            >
              {items.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-[#111e35] border border-white/[0.06] rounded-2xl p-6 relative">
          <h2 className="text-lg font-bold text-white mb-4">{activeItem.title}</h2>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
            {activeItem.contentPayload.question}
          </div>

          {hint && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles size={12} /> AI Hint
              </h4>
              <p className="text-xs text-amber-100/90 leading-relaxed">{hint}</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor & Terminal - Right Panel */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Editor Wrapper */}
        <div className="bg-[#0a1020] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col h-[400px]">
          {/* Editor Toolbar */}
          <div className="h-12 bg-[#111e35] border-b border-white/[0.06] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <select 
                value={language} 
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  setCode(languageBoilerplates[newLang]);
                }}
                className="bg-[#050810] border border-white/[0.08] rounded-md px-2 py-1 text-xs font-semibold text-slate-300 outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <span className="text-xs font-semibold text-slate-500 ml-2">solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'js'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={requestHint} 
                disabled={hintLoading} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all disabled:opacity-50"
              >
                {hintLoading ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} />} 
                {hintLoading ? 'Analyzing...' : 'AI Hint'}
              </button>
              <button 
                onClick={runCode} 
                disabled={running} 
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} 
                Run
              </button>
            </div>
          </div>
          
          {/* Monaco Area */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value: string | undefined) => setCode(value || '')}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 14, 
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace", 
                padding: { top: 16, bottom: 16 }
              }}
              loading={<div className="flex justify-center items-center h-full text-emerald-500"><Loader2 className="animate-spin" /></div>}
            />
          </div>
        </div>

        {/* Terminal Output */}
        <div className="h-[200px] bg-[#050810] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
          <div className="h-10 bg-[#0a1020] border-b border-white/[0.04] flex items-center px-4 gap-2">
            <TerminalSquare size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Console</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {output ? (
              <div className={`${output.includes('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {output}
              </div>
            ) : (
              <span className="text-slate-600 italic">Ready for execution. Awaiting input...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
