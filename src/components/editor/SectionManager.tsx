// File: src/components/editor/SectionManager.tsx
import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
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
import { v4 as uuidv4 } from 'uuid';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, SectionType } from '../../types/resume';
import SummaryEditor from './SummaryEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';
import CertificationsEditor from './CertificationsEditor';
import AwardsEditor from './AwardsEditor';
import VolunteeringEditor from './VolunteeringEditor';
import LanguagesEditor from './LanguagesEditor';
import CoursesEditor from './CoursesEditor';
import AchievementsEditor from './AchievementsEditor';

function SectionEditorContent({ section }: { section: ResumeSection }) {
  switch (section.content.type) {
    case 'summary': return <SummaryEditor section={section} />;
    case 'experience': return <ExperienceEditor section={section} />;
    case 'education': return <EducationEditor section={section} />;
    case 'skills': return <SkillsEditor section={section} />;
    case 'projects': return <ProjectsEditor section={section} />;
    case 'certifications': return <CertificationsEditor section={section} />;
    case 'awards': return <AwardsEditor section={section} />;
    case 'volunteering': return <VolunteeringEditor section={section} />;
    case 'languages': return <LanguagesEditor section={section} />;
    case 'courses': return <CoursesEditor section={section} />;
    case 'achievements': return <AchievementsEditor section={section} />;
    default: return <p className="text-xs text-gray-400 italic">Editor not yet implemented.</p>;
  }
}

function SortableSectionCard({ section }: { section: ResumeSection }) {
  const { toggleSection, updateSection } = useResumeStore();
  const [open, setOpen] = React.useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border shadow-sm bg-white transition-opacity ${!section.enabled ? 'opacity-50' : ''}`}
      aria-label={`Section: ${section.label}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600 select-none text-lg"
          aria-label="Drag to reorder sections"
        >⠿</button>

        <input
          value={section.label}
          onChange={(e) => updateSection(section.id, { label: e.target.value })}
          className="flex-1 font-semibold text-sm text-gray-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
          aria-label="Section label"
        />

        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer" title="Toggle visibility">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={() => toggleSection(section.id)}
            className="w-3.5 h-3.5"
            aria-label={`Toggle ${section.label} section`}
          />
          Show
        </label>

        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          aria-expanded={open}
          aria-label={open ? 'Collapse section' : 'Expand section'}
        >{open ? '▲' : '▼'}</button>
      </div>

      {open && section.enabled && (
        <div className="p-4">
          <SectionEditorContent section={section} />
        </div>
      )}
    </div>
  );
}

export default function SectionManager() {
  const { resume, reorderSections } = useResumeStore();
  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
  const existingTypes = new Set(sorted.map((s) => s.content.type));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((s) => s.id === active.id);
    const newIndex = sorted.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    reorderSections(reordered.map((s) => s.id));
  };

  const ADDABLE_SECTIONS: { type: SectionType; label: string }[] = [
    { type: 'certifications', label: 'Certifications' },
    { type: 'awards', label: 'Awards' },
    { type: 'volunteering', label: 'Volunteering' },
    { type: 'languages', label: 'Languages' },
    { type: 'courses', label: 'Courses' },
    { type: 'achievements', label: 'Achievements' },
  ];

  function buildEmptyContent(type: SectionType): ResumeSection['content'] {
    switch (type) {
      case 'certifications': return { type: 'certifications', items: [] };
      case 'awards': return { type: 'awards', items: [] };
      case 'volunteering': return { type: 'volunteering', items: [] };
      case 'languages': return { type: 'languages', items: [] };
      case 'courses': return { type: 'courses', items: [] };
      case 'achievements': return { type: 'achievements', items: [] };
      default: return { type: 'custom', title: '', items: [] };
    }
  }

  function handleAddSection(type: SectionType, label: string) {
    const id = uuidv4();
    const newSection: ResumeSection = {
      id,
      type,
      label,
      enabled: true,
      order: sorted.length,
      content: buildEmptyContent(type),
    };
    // Use updateSection pattern: inject into sections via store's state updater
    // We call reorderSections after adding to keep order consistent.
    // Since we don't have an addSection action, we piggyback on the store's sections array
    // by directly setting state via importResume would be heavy — instead we call
    // updateSection which patches an existing section. We need a different approach.
    // Use the store's updateSection to add; we'll extend via a temporary method.
    // Actually the cleanest is to dispatch to the existing store via the Zustand set.
    // We can exploit that addXxx mutations do exist. For unknown types we use resetResume pattern.
    // Simplest: use a direct Zustand mutation via the store's setState.
    const store = useResumeStore.getState();
    const newResume = {
      ...store.resume,
      sections: [...store.resume.sections, newSection],
      meta: { ...store.resume.meta, updatedAt: new Date().toISOString() },
    };
    store.importResume(newResume);
  }

  const availableToAdd = ADDABLE_SECTIONS.filter((s) => !existingTypes.has(s.type));

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((section) => (
            <SortableSectionCard key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>

      {availableToAdd.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 font-medium mb-2">Add Section</p>
          <div className="flex flex-wrap gap-2">
            {availableToAdd.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleAddSection(type, label)}
                className="text-xs bg-white border border-gray-300 text-gray-600 rounded-full px-3 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
