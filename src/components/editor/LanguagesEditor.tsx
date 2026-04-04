// File: src/components/editor/LanguagesEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, LanguageItem } from '../../types/resume';

interface Props { section: ResumeSection }

const PROFICIENCY_LEVELS: LanguageItem['proficiency'][] = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

function LanguageRow({ item, sectionId }: { item: LanguageItem; sectionId: string }) {
  const { updateLanguage, removeLanguage } = useResumeStore();
  const upd = (partial: Partial<LanguageItem>) => updateLanguage(sectionId, item.id, partial);

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <input
        value={item.language}
        onChange={(e) => upd({ language: e.target.value })}
        placeholder="English"
        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        aria-label="Language name"
      />
      <select
        value={item.proficiency}
        onChange={(e) => upd({ proficiency: e.target.value as LanguageItem['proficiency'] })}
        className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        aria-label="Proficiency level"
      >
        {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <button
        onClick={() => removeLanguage(sectionId, item.id)}
        className="text-red-400 hover:text-red-600 text-xs px-1"
        aria-label="Remove language"
      >✕</button>
    </div>
  );
}

export default function LanguagesEditor({ section }: Props) {
  const { addLanguage } = useResumeStore();
  if (section.content.type !== 'languages') return null;
  const items = section.content.items;

  return (
    <div className="space-y-1">
      <div className="flex text-xs text-gray-400 font-medium px-0.5 mb-1 gap-2">
        <span className="flex-1">Language</span>
        <span className="w-28 text-center">Proficiency</span>
        <span className="w-5" />
      </div>
      {items.map((item) => <LanguageRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No languages yet.</p>}
      <button
        onClick={() => addLanguage(section.id)}
        className="w-full mt-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Language
      </button>
    </div>
  );
}
