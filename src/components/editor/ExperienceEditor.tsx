// File: src/components/editor/ExperienceEditor.tsx
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, ExperienceItem } from '../../types/resume';

interface Props { section: ResumeSection }

function BulletRow({ bullet, onUpdate, onRemove }: { bullet: { id: string; text: string }, onUpdate: (text: string) => void, onRemove: () => void }) {
  return (
    <div className="flex items-start gap-2 group">
      <span className="text-gray-400 mt-2 text-xs">•</span>
      <textarea
        value={bullet.text}
        onChange={(e) => onUpdate(e.target.value)}
        rows={2}
        placeholder="• Achieved X by doing Y, resulting in Z..."
        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
        aria-label="Bullet point"
      />
      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1"
        aria-label="Remove bullet"
      >✕</button>
    </div>
  );
}

function SortableItem({ item, sectionId }: { item: ExperienceItem; sectionId: string }) {
  const { updateExperienceItem, removeExperienceItem, addBulletToExperience, updateBullet, removeBullet } = useResumeStore();
  const [open, setOpen] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const upd = (partial: Partial<ExperienceItem>) => updateExperienceItem(sectionId, item.id, partial);

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 select-none" aria-label="Drag to reorder">⠿</button>
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.role || 'New Position'}{item.company ? ` @ ${item.company}` : ''}
        </button>
        <button onClick={() => { if (confirm('Remove this experience?')) removeExperienceItem(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs" aria-label="Remove experience entry">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>

      {open && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Job Title</label>
              <input value={item.role} onChange={(e) => upd({ role: e.target.value })} placeholder="Software Engineer" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Company</label>
              <input value={item.company} onChange={(e) => upd({ company: e.target.value })} placeholder="Company Inc." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Start (YYYY-MM)</label>
              <input value={item.startDate} onChange={(e) => upd({ startDate: e.target.value })} placeholder="2022-06" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">End (YYYY-MM)</label>
              <input value={item.endDate} onChange={(e) => upd({ endDate: e.target.value })} disabled={item.current} placeholder="2024-01" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={item.current} onChange={(e) => upd({ current: e.target.checked, endDate: e.target.checked ? '' : item.endDate })} className="w-3 h-3" />
                Present
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Location</label>
              <input value={item.location} onChange={(e) => upd({ location: e.target.value })} placeholder="City, State" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Employment Type</label>
              <select
                value={item.employmentType ?? ''}
                onChange={(e) => upd({ employmentType: e.target.value })}
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                aria-label="Employment type"
              >
                <option value="">— Select —</option>
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Apprenticeship'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Tech Stack (comma-separated)</label>
            <input
              value={(item.techStack ?? []).join(', ')}
              onChange={(e) => upd({ techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              placeholder="React, Node.js, PostgreSQL, AWS"
              className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              aria-label="Tech stack"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-600">Bullet Points</label>
              <button onClick={() => addBulletToExperience(sectionId, item.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Bullet</button>
            </div>
            <div className="space-y-1.5">
              {item.bullets.map((b) => (
                <BulletRow
                  key={b.id}
                  bullet={b}
                  onUpdate={(text) => updateBullet(sectionId, item.id, b.id, text)}
                  onRemove={() => removeBullet(sectionId, item.id, b.id)}
                />
              ))}
              {item.bullets.length === 0 && <p className="text-xs text-gray-400 italic">No bullet points yet. Click "+ Add Bullet".</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceEditor({ section }: Props) {
  const { addExperienceItem, reorderExperienceItems } = useResumeStore();
  if (section.content.type !== 'experience') return null;
  const items = section.content.items;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    reorderExperienceItems(section.id, reordered.map((i) => i.id));
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => <SortableItem key={item.id} item={item} sectionId={section.id} />)}
        </SortableContext>
      </DndContext>
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No experience entries. Click below to add one.</p>}
      <button
        onClick={() => addExperienceItem(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
        aria-label="Add experience entry"
      >
        + Add Experience
      </button>
    </div>
  );
}
