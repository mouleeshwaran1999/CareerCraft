// File: src/components/editor/AwardsEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, AwardItem } from '../../types/resume';

interface Props { section: ResumeSection }

function AwardRow({ item, sectionId }: { item: AwardItem; sectionId: string }) {
  const { updateAward, removeAward } = useResumeStore();
  const upd = (partial: Partial<AwardItem>) => updateAward(sectionId, item.id, partial);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.title || 'New Award'}
        </button>
        <button onClick={() => { if (confirm('Remove this award?')) removeAward(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Award Title</label>
            <input value={item.title} onChange={(e) => upd({ title: e.target.value })} placeholder="Best Innovation Award" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Organization</label>
              <input value={item.organization} onChange={(e) => upd({ organization: e.target.value })} placeholder="Company / Conference" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Date (YYYY-MM)</label>
              <input value={item.date} onChange={(e) => upd({ date: e.target.value })} placeholder="2023-12" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Description</label>
            <textarea value={item.description} onChange={(e) => upd({ description: e.target.value })} rows={2} placeholder="Brief description of the award..." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AwardsEditor({ section }: Props) {
  const { addAward } = useResumeStore();
  if (section.content.type !== 'awards') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <AwardRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No awards yet.</p>}
      <button
        onClick={() => addAward(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Award
      </button>
    </div>
  );
}
