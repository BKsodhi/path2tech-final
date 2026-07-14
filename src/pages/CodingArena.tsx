import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  Lightbulb,
  Sparkles,
  CheckCircle,
  Lock,
  Star,
  RefreshCw,
  Play
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { SubmissionsList } from "../components/SubmissionsList";
import { Discussions } from "../components/Discussions";

const CODE_LINES = [
  { n: 1, tokens: [{ t: "keyword", v: "def " }, { t: "fn", v: "solution" }, { t: "plain", v: "():" }] },
  { n: 2, tokens: [{ t: "plain", v: "    " }, { t: "keyword", v: "pass" }] },
];
const TOKEN_COLOR: Record<string, string> = {
  keyword: "#7dd3fc",
  fn: "#a5f3fc",
  param: "#c4b5fd",
  plain: "#cbd5e1",
  str: "#86efac",
  num: "#fca5a5",
};

export function CodingArena() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { token, solveProblem } = useAppContext();
  const [problemTab, setProblemTab] = useState<"description" | "hints" | "solution" | "submissions" | "discussions">("description");
  const [consoleTab, setConsoleTab] = useState<"testcases" | "console">("testcases");
  const [hintVisible, setHintVisible] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (token) {
      // If we have a problemId, fetch that specific one, else fallback to all problems
      const url = problemId ? `/api/content/problems/${problemId}` : '/api/content/problems';
      fetch(url, {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            setProblem(data[0]);
            setCode(data[0].starterCode || "def solution():\n    pass");
          }
        } else {
          setProblem(data);
          setCode(data.starterCode || "def solution():\n    pass");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, problemId]);

  async function handleRunCode() {
    setConsoleTab("console");
    setIsRunning(true);
    setOutput("Running test cases...");
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          code,
          language: 'python',
          problemId: problem._id
        })
      });
      const data = await res.json();
      
      let out = "";
      if (data.execution) {
        if (data.execution.stderr) out += `[Error]\n${data.execution.stderr}\n\n`;
        if (data.execution.stdout) out += `[Output]\n${data.execution.stdout}\n`;
      }
      out += `\nResult: ${data.message}`;
      
      setOutput(out.trim());
      
      if (data.success) {
        solveProblem(problem.xp || 50);
      }
    } catch (err: any) {
      setOutput(`Failed to connect to execution engine: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-400">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="h-full flex items-center justify-center text-slate-400">No problems found.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Split panels */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Problem */}
        <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0d1627]">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-0 px-4 pt-4 border-b border-white/[0.06]">
            {(["description", "submissions", "discussions", "hints", "solution"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setProblemTab(t)}
                className={`px-3 py-2 text-xs font-semibold capitalize rounded-t-lg transition-colors ${
                  problemTab === t
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Problem content */}
          <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
            {problemTab === "description" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500">1.</span>
                    <h2 className="text-base font-bold text-white">{problem.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/12 text-emerald-400'
                      : problem.difficulty === 'Medium' ? 'bg-amber-500/12 text-amber-400'
                      : 'bg-rose-500/12 text-rose-400'
                    }`}>{problem.difficulty}</span>
                    <span className="text-[10px] text-slate-600">{problem.tags?.join(' · ')}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>

                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Examples</div>
                    {problem.examples.map((ex: any, i: number) => (
                      <div key={i} className="bg-[#0a1020] border border-white/[0.04] rounded-xl p-3.5 mb-2 font-mono text-xs space-y-1.5">
                        <div><span className="text-slate-500">Input: </span><span className="text-slate-300">{ex.input}</span></div>
                        <div><span className="text-slate-500">Output: </span><span className="text-emerald-400">{ex.output}</span></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Hint button */}
                <button
                  onClick={() => setHintVisible(true)}
                  className="w-full flex items-center justify-center gap-2 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 hover:border-violet-500/35 text-violet-300 hover:text-violet-200 text-sm font-semibold py-2.5 rounded-xl transition-all duration-150"
                >
                  <Lightbulb size={15} />
                  Request AI Hint — no penalty!
                </button>

                {hintVisible && (
                  <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={13} className="text-violet-400" />
                      <span className="text-xs font-bold text-violet-300">AI Hint</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Think about how a hash map (dictionary) lets you check if the complement of the current number exists in O(1) time. Try iterating once through the array and storing what you've seen!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Solution Tab */}
            {problemTab === "solution" && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-300">Optimal Approach</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use a hash map to store the elements and their indices. For each element, check if the complement (target - element) exists in the map.
                </p>
              </div>
            )}

            {/* Submissions Tab */}
            {problemTab === "submissions" && (
              <SubmissionsList problemId={problem._id} />
            )}

            {/* Discussions Tab */}
            {problemTab === "discussions" && (
              <Discussions problemId={problem._id} />
            )}

            {problemTab === "hints" && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-4">Unlock hints one at a time — no judgement here!</div>
                {[
                  { level: "Hint 1", text: "Can you solve it in O(n²) first? Brute force is a valid starting point.", unlocked: true },
                  { level: "Hint 2", text: "What data structure gives O(1) lookup? Think about what you need to find for each element.", unlocked: true },
                  { level: "Hint 3", text: "For each num, you need target - num. Check if that complement already exists in your hash map!", unlocked: false },
                ].map(({ level, text, unlocked }) => (
                  <div key={level} className={`border rounded-xl p-4 ${unlocked ? "bg-[#111e35] border-white/[0.06]" : "bg-[#111e35]/50 border-white/[0.03]"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {unlocked ? <CheckCircle size={12} className="text-emerald-400" /> : <Lock size={12} className="text-slate-600" />}
                      <span className="text-xs font-bold text-slate-400">{level}</span>
                    </div>
                    {unlocked
                      ? <p className="text-sm text-slate-300">{text}</p>
                      : <div className="text-xs text-slate-600 italic">Tap to unlock this hint</div>}
                  </div>
                ))}
              </div>
            )}

            {problemTab === "solution" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3">
                  <Star size={12} />
                  <span>Try solving it yourself first — you've got this!</span>
                </div>
                <div className="bg-[#0a1020] border border-white/[0.04] rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed">
                  {CODE_LINES.map((line) => (
                    <div key={line.n} className="flex gap-3">
                      <span className="text-slate-700 w-4 flex-shrink-0 text-right select-none">{line.n}</span>
                      <span>
                        {line.tokens.map((tok, i) => (
                          <span key={i} style={{ color: TOKEN_COLOR[tok.t] }}>{tok.v}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#090e1c]">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-slate-500 ml-2 font-mono">solution.py</span>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-xs text-slate-400 bg-[#111e35] border border-white/[0.06] rounded-lg px-2 py-1 appearance-none cursor-pointer hover:border-white/15 transition-colors">
                <option>Python 3</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
              </select>
              <button className="text-xs text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-hidden p-0 relative" style={{ scrollbarWidth: "thin", scrollbarColor: "#1a2d4a transparent" }}>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-slate-300 font-mono text-[13px] leading-6 p-4 resize-none outline-none focus:ring-0 border-none"
              style={{ fontFamily: "'JetBrains Mono', monospace", tabSize: 4 }}
              spellCheck={false}
            />
          </div>

          {/* Console panel */}
          <div className="border-t border-white/[0.06] flex-shrink-0" style={{ height: 190 }}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-0">
                {(["testcases", "console"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setConsoleTab(t)}
                    className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors rounded-lg ${
                      consoleTab === t ? "text-cyan-400 bg-cyan-500/8" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {t === "testcases" ? "Test Cases" : "Console"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                    isRunning
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-not-allowed"
                      : "bg-[#111e35] text-slate-300 border border-white/[0.08] hover:border-white/15 hover:text-white"
                  }`}
                >
                  <Play size={11} fill="currentColor" />
                  {isRunning ? "Running…" : "Run Code"}
                </button>
                <button 
                  onClick={() => solveProblem(problem.xp || 50)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white transition-all duration-150 shadow-md shadow-cyan-500/20"
                >
                  <CheckCircle size={11} />
                  Submit
                </button>
              </div>
            </div>

            <div className="px-4 py-3 overflow-y-auto h-[calc(100%-42px)]" style={{ scrollbarWidth: "none" }}>
              {consoleTab === "testcases" && (
                <div className="space-y-2">
                  {[
                    { input: "[2,7,11,15], target = 9", expected: "[0,1]", status: "pass" },
                    { input: "[3,2,4], target = 6", expected: "[1,2]", status: "pass" },
                    { input: "[3,3], target = 6", expected: "[0,1]", status: "pending" },
                  ].map((tc, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-mono">
                      <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${tc.status === "pass" ? "bg-emerald-500/12 text-emerald-400" : "bg-slate-700/50 text-slate-500"}`}>
                        {tc.status === "pass" ? "PASS" : "—"}
                      </span>
                      <span className="text-slate-500">Case {i + 1}:</span>
                      <span className="text-slate-400">{tc.input}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-cyan-400">{tc.expected}</span>
                    </div>
                  ))}
                </div>
              )}
              {consoleTab === "console" && (
                <div className="font-mono text-xs space-y-1">
                  {isRunning ? (
                    <div className="text-cyan-400 animate-pulse">Executing code...</div>
                  ) : (
                    <pre className="text-slate-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {output || "Run your code to see the output here."}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
