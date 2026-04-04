// File: src/components/editor/CoursesEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, CourseItem } from '../../types/resume';

interface Props { section: ResumeSection }

function CourseRow({ item, sectionId }: { item: CourseItem; sectionId: string }) {
  const { updateCourse, removeCourse } = useResumeStore();
  const upd = (partial: Partial<CourseItem>) => updateCourse(sectionId, item.id, partial);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.name || 'New Course'}
        </button>
        <button onClick={() => { if (confirm('Remove this course?')) removeCourse(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Course Name</label>
            <input value={item.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Machine Learning Specialization" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Institution / Platform</label>
              <input value={item.institution} onChange={(e) => upd({ institution: e.target.value })} placeholder="Coursera / MIT" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Completion Date (YYYY-MM)</label>
              <input value={item.date} onChange={(e) => upd({ date: e.target.value })} placeholder="2023-09" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Certificate URL</label>
            <input value={item.url} onChange={(e) => upd({ url: e.target.value })} type="url" placeholder="https://coursera.org/verify/..." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesEditor({ section }: Props) {
  const { addCourse } = useResumeStore();
  if (section.content.type !== 'courses') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <CourseRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No courses yet.</p>}
      <button
        onClick={() => addCourse(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Course
      </button>
    </div>
  );
}
