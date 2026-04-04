// File: src/components/editor/VolunteeringEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, VolunteeringItem } from '../../types/resume';

interface Props { section: ResumeSection }

function VolunteerRow({ item, sectionId }: { item: VolunteeringItem; sectionId: string }) {
  const { updateVolunteering, removeVolunteering } = useResumeStore();
  const upd = (partial: Partial<VolunteeringItem>) => updateVolunteering(sectionId, item.id, partial);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.role || 'Volunteer Role'}{item.organization ? ` @ ${item.organization}` : ''}
        </button>
        <button onClick={() => { if (confirm('Remove this entry?')) removeVolunteering(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Role</label>
              <input value={item.role} onChange={(e) => upd({ role: e.target.value })} placeholder="Event Coordinator" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Organization</label>
              <input value={item.organization} onChange={(e) => upd({ organization: e.target.value })} placeholder="Red Cross" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Start (YYYY-MM)</label>
              <input value={item.startDate} onChange={(e) => upd({ startDate: e.target.value })} placeholder="2022-01" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">End (YYYY-MM)</label>
              <input value={item.endDate} onChange={(e) => upd({ endDate: e.target.value })} disabled={item.current} placeholder="2023-06" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={item.current} onChange={(e) => upd({ current: e.target.checked, endDate: e.target.checked ? '' : item.endDate })} className="w-3 h-3" />
                Present
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Description</label>
            <textarea value={item.description} onChange={(e) => upd({ description: e.target.value })} rows={2} placeholder="Describe your contribution..." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VolunteeringEditor({ section }: Props) {
  const { addVolunteering } = useResumeStore();
  if (section.content.type !== 'volunteering') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <VolunteerRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No volunteering entries yet.</p>}
      <button
        onClick={() => addVolunteering(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Volunteering
      </button>
    </div>
  );
}
