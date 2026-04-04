// File: src/components/ats/ATSChecker.tsx
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { analyzeResume } from '../../features/ats/atsAnalyzer';
import { SAMPLE_JOB_DESCRIPTION } from '../../data/sampleResume';
import type { ATSSuggestion } from '../../types/resume';

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${score} out of 100`}
        />
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 75 ? '#059669' : score >= 50 ? '#f59e0b' : '#dc2626';
  const bg = score >= 75 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2';
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work';
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-24 h-24 rounded-full flex flex-col items-center justify-center border-4"
        style={{ background: bg, borderColor: color }}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`ATS score: ${score} out of 100`}
      >
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      </div>
      <span className="text-xs text-gray-500 mt-1">ATS Score</span>
    </div>
  );
}

function SuggestionCard({ suggestion, onApply, onReject }: { suggestion: ATSSuggestion; onApply: () => void; onReject: () => void }) {
  const [expanded, setExpanded] = useState(false);

  if (suggestion.rejected) return null;

  const typeColors: Record<string, string> = {
    rewrite: 'bg-blue-50 border-blue-200 text-blue-700',
    add: 'bg-green-50 border-green-200 text-green-700',
    remove: 'bg-red-50 border-red-200 text-red-700',
    format: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className={`border rounded-lg p-3 ${suggestion.applied ? 'opacity-60 bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${typeColors[suggestion.type] ?? typeColors.rewrite}`}>
              {suggestion.type}
            </span>
            {suggestion.applied && <span className="text-xs text-green-600 font-medium">✓ Applied</span>}
          </div>
          <p className="text-xs text-gray-600">{suggestion.reason}</p>

          {!suggestion.applied && (
            <button onClick={() => setExpanded((e) => !e)} className="text-xs text-blue-600 hover:underline mt-1">
              {expanded ? 'Hide diff ▲' : 'View suggestion ▼'}
            </button>
          )}

          {expanded && !suggestion.applied && (
            <div className="mt-2 space-y-1.5 text-xs">
              <div className="bg-red-50 border border-red-100 rounded p-2">
                <span className="font-semibold text-red-600 block mb-0.5">Current:</span>
                <span className="text-red-800 italic">"{suggestion.original}"</span>
              </div>
              <div className="bg-green-50 border border-green-100 rounded p-2">
                <span className="font-semibold text-green-600 block mb-0.5">Suggested:</span>
                <span className="text-green-800 italic">"{suggestion.suggestion}"</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!suggestion.applied && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onApply}
            className="flex-1 bg-green-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors min-h-[44px]"
            aria-label="Apply this suggestion"
          >
            ✓ Apply
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-gray-100 text-gray-600 text-xs font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
            aria-label="Reject this suggestion"
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function ATSChecker() {
  const { resume, atsJobDescription, atsResult, setATSJobDescription, setATSResult, applyATSSuggestion, rejectATSSuggestion } = useResumeStore();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!atsJobDescription.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const result = analyzeResume(resume, atsJobDescription);
      setATSResult(result);
      setAnalyzing(false);
    }, 600); // brief artificial delay for UX
  };

  const scoreColor = atsResult
    ? atsResult.totalScore >= 75 ? '#059669' : atsResult.totalScore >= 50 ? '#f59e0b' : '#dc2626'
    : '#6b7280';

  const activeSuggestions = atsResult?.suggestions.filter((s) => !s.rejected) ?? [];
  const appliedCount = atsResult?.suggestions.filter((s) => s.applied).length ?? 0;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ATS Score Checker</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800" role="note" aria-label="ATS disclaimer">
          <strong>⚠ Disclaimer:</strong> ATS scores are estimates only. Different ATS systems (Workday, Greenhouse, Lever, etc.) vary significantly in how they parse and score resumes. Use this tool as guidance, not a guarantee. Always tailor your resume to each job description.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Job Description Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="jd-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              id="jd-input"
              value={atsJobDescription}
              onChange={(e) => setATSJobDescription(e.target.value)}
              rows={14}
              placeholder="Paste the full job description here..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              aria-label="Job description input"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAnalyze}
                disabled={!atsJobDescription.trim() || analyzing}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                aria-label="Analyze resume against job description"
              >
                {analyzing ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
              </button>
              <button
                onClick={() => setATSJobDescription(SAMPLE_JOB_DESCRIPTION)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
                aria-label="Load sample job description"
                title="Load sample job description"
              >
                Load Sample JD
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!atsResult && !analyzing && (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm font-medium">Paste a job description and click Analyze</p>
              <p className="text-xs mt-1">to see your ATS compatibility score</p>
            </div>
          )}

          {analyzing && (
            <div className="h-full min-h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" role="status" aria-label="Analyzing" />
              <p className="text-sm text-gray-500">Analyzing your resume...</p>
            </div>
          )}

          {atsResult && !analyzing && (
            <div className="space-y-4">
              {/* Score Overview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-6 mb-4">
                  <ScoreCircle score={atsResult.totalScore} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Analyzed {new Date(atsResult.analyzedAt).toLocaleTimeString()}</p>
                    <p className="text-xs text-gray-600">{atsResult.matchedKeywords.length} of {atsResult.matchedKeywords.length + atsResult.missingKeywords.length} keywords matched</p>
                    {appliedCount > 0 && <p className="text-xs text-green-600 font-medium mt-1">{appliedCount} suggestions applied</p>}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <ScoreBar label="Keyword Match" score={atsResult.breakdown.keywordScore} color={scoreColor} />
                  <ScoreBar label="Section Completeness" score={atsResult.breakdown.completenessScore} color="#6366f1" />
                  <ScoreBar label="Readability" score={atsResult.breakdown.readabilityScore} color="#0ea5e9" />
                  <ScoreBar label="Formatting" score={atsResult.breakdown.formattingScore} color="#8b5cf6" />
                </div>
              </div>

              {/* Warnings */}
              {atsResult.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <h3 className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">Warnings</h3>
                  <ul className="space-y-1">
                    {atsResult.warnings.map((w, i) => (
                      <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                        <span className="shrink-0">⚠</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {atsResult.missingKeywords.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <h3 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">Missing Keywords (top 15)</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missingKeywords.map((kw) => (
                      <span key={kw} className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Keywords */}
              {atsResult.matchedKeywords.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <h3 className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide">Matched Keywords ({atsResult.matchedKeywords.length})</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matchedKeywords.slice(0, 20).map((kw) => (
                      <span key={kw.keyword} className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                        {kw.keyword}
                      </span>
                    ))}
                    {atsResult.matchedKeywords.length > 20 && (
                      <span className="text-xs text-green-600">+{atsResult.matchedKeywords.length - 20} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {atsResult && activeSuggestions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              Improvement Suggestions <span className="text-sm text-gray-500 font-normal">({activeSuggestions.filter(s => !s.applied).length} pending)</span>
            </h2>
            <p className="text-xs text-gray-400">Review each suggestion carefully before applying.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSuggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onApply={() => applyATSSuggestion(s.id)}
                onReject={() => rejectATSSuggestion(s.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
