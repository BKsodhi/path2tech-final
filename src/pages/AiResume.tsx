import React from "react";
import { Sparkles } from "lucide-react";
import { AtsMatcher } from "../components/resume/AtsMatcher";

export function AiResume() {
  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="text-violet-400" size={24} /> 
          AI Resume Studio & ATS Matcher
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Paste your resume and a target job description below. Our Gemini-powered ATS AI will instantly scan for missing keywords and give you actionable feedback to secure an interview.
        </p>
      </div>

      {/* Main Component */}
      <AtsMatcher />
    </div>
  );
}
