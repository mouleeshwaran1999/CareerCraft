// File: src/components/editor/AchievementsEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, AchievementItem } from '../../types/resume';

interface Props { section: ResumeSection }

function AchievementRow({ item, sectionId }: { item: AchievementItem; sectionId: string }) {
  const { updateAchievement, removeAchievement } = useResumeStore();
  const upd = (partial: Partial<AchievementItem>) => updateAchievement(sectionId, item.id, partial);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.title || 'New Achievement'}
        </button>
        <button onClick={() => { if (confirm('Remove this achievement?')) removeAchievement(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-0.5">Achievement Title</label>
              <input value={item.title} onChange={(e) => upd({ title: e.target.value })} placeholder="Launched feature used by 1M+ users" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Date (YYYY-MM)</label>
              <input value={item.date} onChange={(e) => upd({ date: e.target.value })} placeholder="2023-06" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Description</label>
            <textarea value={item.description} onChange={(e) => upd({ description: e.target.value })} rows={2} placeholder="Context and impact of the achievement..." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AchievementsEditor({ section }: Props) {
  const { addAchievement } = useResumeStore();
  if (section.content.type !== 'achievements') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <AchievementRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No achievements yet.</p>}
      <button
        onClick={() => addAchievement(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Achievement
      </button>
    </div>
  );
}
