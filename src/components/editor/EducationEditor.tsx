// File: src/components/editor/EducationEditor.tsx
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, EducationItem } from '../../types/resume';

interface Props { section: ResumeSection }

function EducationItem_({ item, sectionId }: { item: EducationItem; sectionId: string }) {
  const { updateEducationItem, removeEducationItem } = useResumeStore();
  const [open, setOpen] = useState(true);
  const upd = (partial: Partial<EducationItem>) => updateEducationItem(sectionId, item.id, partial);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.degree || 'New Degree'}{item.institution ? ` — ${item.institution}` : ''}
        </button>
        <button onClick={() => { if (confirm('Remove this education entry?')) removeEducationItem(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs" aria-label="Remove education entry">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Degree</label>
              <input value={item.degree} onChange={(e) => upd({ degree: e.target.value })} placeholder="Bachelor of Science" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Field of Study</label>
              <input value={item.field} onChange={(e) => upd({ field: e.target.value })} placeholder="Computer Science" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Institution</label>
            <input value={item.institution} onChange={(e) => upd({ institution: e.target.value })} placeholder="University of State" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Start (YYYY-MM)</label>
              <input value={item.startDate} onChange={(e) => upd({ startDate: e.target.value })} placeholder="2015-08" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">End (YYYY-MM)</label>
              <input value={item.endDate} onChange={(e) => upd({ endDate: e.target.value })} placeholder="2019-05" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">GPA</label>
              <input value={item.gpa} onChange={(e) => upd({ gpa: e.target.value })} placeholder="3.8" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Honors / Awards</label>
            <input value={item.honors} onChange={(e) => upd({ honors: e.target.value })} placeholder="Magna Cum Laude" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationEditor({ section }: Props) {
  const { addEducationItem } = useResumeStore();
  if (section.content.type !== 'education') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <EducationItem_ key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No education entries yet.</p>}
      <button
        onClick={() => addEducationItem(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
        aria-label="Add education entry"
      >
        + Add Education
      </button>
    </div>
  );
}
