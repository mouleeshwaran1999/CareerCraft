// File: src/components/editor/ProjectsEditor.tsx
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
import type { ResumeSection, ProjectItem } from '../../types/resume';

interface Props { section: ResumeSection }

function SortableProjectItem({ item, sectionId }: { item: ProjectItem; sectionId: string }) {
  const { updateProjectItem, removeProjectItem, addBulletToProject, updateProjectBullet, removeProjectBullet } = useResumeStore();
  const [open, setOpen] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const upd = (partial: Partial<ProjectItem>) => updateProjectItem(sectionId, item.id, partial);

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 select-none" aria-label="Drag to reorder">⠿</button>
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.name || 'New Project'}
        </button>
        <button onClick={() => { if (confirm('Remove this project?')) removeProjectItem(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs" aria-label="Remove project">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>

      {open && (
        <div className="p-3 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Project Name</label>
            <input value={item.name} onChange={(e) => upd({ name: e.target.value })} placeholder="My Awesome Project" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Your Role</label>
              <input value={item.role ?? ''} onChange={(e) => upd({ role: e.target.value })} placeholder="Lead Developer" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Tech Stack</label>
              <input value={item.techStack} onChange={(e) => upd({ techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Description</label>
            <input value={item.description} onChange={(e) => upd({ description: e.target.value })} placeholder="Brief project description" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Start (YYYY-MM)</label>
              <input value={item.startDate} onChange={(e) => upd({ startDate: e.target.value })} placeholder="2023-01" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">End (YYYY-MM)</label>
              <input value={item.endDate} onChange={(e) => upd({ endDate: e.target.value })} placeholder="2023-06" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">GitHub URL</label>
              <input value={item.githubUrl ?? ''} onChange={(e) => upd({ githubUrl: e.target.value })} type="url" placeholder="https://github.com/you/project" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Live / Demo URL</label>
              <input value={item.liveUrl ?? ''} onChange={(e) => upd({ liveUrl: e.target.value })} type="url" placeholder="https://myproject.app" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-600">Bullet Points</label>
              <button onClick={() => addBulletToProject(sectionId, item.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Bullet</button>
            </div>
            <div className="space-y-1.5">
              {item.bullets.map((b) => (
                <div key={b.id} className="flex items-start gap-2 group">
                  <span className="text-gray-400 mt-2 text-xs">•</span>
                  <textarea
                    value={b.text}
                    onChange={(e) => updateProjectBullet(sectionId, item.id, b.id, e.target.value)}
                    rows={2}
                    placeholder="Built X feature resulting in Y improvement..."
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                    aria-label="Project bullet point"
                  />
                  <button onClick={() => removeProjectBullet(sectionId, item.id, b.id)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1" aria-label="Remove bullet">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsEditor({ section }: Props) {
  const { addProjectItem, reorderProjectItems } = useResumeStore();
  if (section.content.type !== 'projects') return null;
  const items = section.content.items;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    reorderProjectItems(section.id, reordered.map((i) => i.id));
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => <SortableProjectItem key={item.id} item={item} sectionId={section.id} />)}
        </SortableContext>
      </DndContext>
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No projects yet.</p>}
      <button
        onClick={() => addProjectItem(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
        aria-label="Add project"
      >
        + Add Project
      </button>
    </div>
  );
}
