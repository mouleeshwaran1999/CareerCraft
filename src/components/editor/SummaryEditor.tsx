// File: src/components/editor/SummaryEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection } from '../../types/resume';

interface Props { section: ResumeSection }

export default function SummaryEditor({ section }: Props) {
  const { updateSummary } = useResumeStore();
  if (section.content.type !== 'summary') return null;
  const text = section.content.text;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="summary-text">
        Summary <span className="text-gray-400">({text.split(/\s+/).filter(Boolean).length} words)</span>
      </label>
      <textarea
        id="summary-text"
        rows={5}
        value={text}
        onChange={(e) => updateSummary(section.id, e.target.value)}
        placeholder="Write a compelling 2–4 sentence professional summary..."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        aria-label="Professional summary"
      />
    </div>
  );
}
