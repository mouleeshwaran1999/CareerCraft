// File: src/components/editor/SkillsEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, SkillGroup } from '../../types/resume';

interface Props { section: ResumeSection }

function SkillGroupRow({ group, sectionId }: { group: SkillGroup; sectionId: string }) {
  const { updateSkillGroup, removeSkillGroup } = useResumeStore();
  return (
    <div className="flex gap-2 items-start group">
      <div className="w-32 flex-shrink-0">
        <input
          value={group.category}
          onChange={(e) => updateSkillGroup(sectionId, group.id, { category: e.target.value })}
          placeholder="Category"
          className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          aria-label="Skill category"
        />
      </div>
      <input
        value={group.skills}
        onChange={(e) => updateSkillGroup(sectionId, group.id, { skills: e.target.value })}
        placeholder="Skill1, Skill2, Skill3..."
        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        aria-label="Skills list"
      />
      <button
        onClick={() => removeSkillGroup(sectionId, group.id)}
        className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        aria-label="Remove skill group"
      >✕</button>
    </div>
  );
}

export default function SkillsEditor({ section }: Props) {
  const { addSkillGroup } = useResumeStore();
  if (section.content.type !== 'skills') return null;
  const groups = section.content.groups;

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Each row is a skill category. Separate skills with commas.</p>
      <div className="flex gap-2 text-xs text-gray-400 font-medium px-0.5">
        <span className="w-32">Category</span>
        <span>Skills (comma-separated)</span>
      </div>
      {groups.map((g) => <SkillGroupRow key={g.id} group={g} sectionId={section.id} />)}
      {groups.length === 0 && <p className="text-xs text-gray-400 italic">No skill groups yet.</p>}
      <button
        onClick={() => addSkillGroup(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
        aria-label="Add skill group"
      >
        + Add Skill Group
      </button>
    </div>
  );
}
