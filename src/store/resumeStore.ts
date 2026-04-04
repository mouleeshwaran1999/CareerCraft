// File: src/store/resumeStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Resume,
  ResumeSection,
  ResumeStyles,
  ResumeHeader,
  HistoryEntry,
  ATSResult,
  DisplaySettings,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  BulletPoint,
  CertificationItem,
  AwardItem,
  VolunteeringItem,
  LanguageItem,
  CourseItem,
  AchievementItem,
} from '../types/resume';
import { saveToStorage, loadFromStorage, DEFAULT_DISPLAY_SETTINGS } from '../utils/storage';

const MAX_HISTORY = 50;

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleAutosave(resume: Resume, displaySettings: DisplaySettings) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => saveToStorage(resume, displaySettings), 500);
}

export type AppPage = 'templates' | 'editor' | 'ats' | 'export';

interface ResumeStore {
  resume: Resume;
  displaySettings: DisplaySettings;
  past: HistoryEntry[];
  future: HistoryEntry[];
  currentPage: AppPage;
  atsResult: ATSResult | null;
  atsJobDescription: string;

  // Navigation
  setPage: (page: AppPage) => void;

  // Display settings
  updateDisplaySettings: (partial: Partial<DisplaySettings>) => void;

  // Resume mutations
  updateHeader: (header: Partial<ResumeHeader>) => void;
  updateStyles: (styles: Partial<ResumeStyles>) => void;
  applyTemplate: (templateId: string, styles: Partial<ResumeStyles>) => void;
  updateSection: (sectionId: string, partial: Partial<ResumeSection>) => void;
  reorderSections: (orderedIds: string[]) => void;
  toggleSection: (sectionId: string) => void;

  // Experience mutations
  addExperienceItem: (sectionId: string) => void;
  updateExperienceItem: (sectionId: string, itemId: string, partial: Partial<ExperienceItem>) => void;
  removeExperienceItem: (sectionId: string, itemId: string) => void;
  reorderExperienceItems: (sectionId: string, orderedIds: string[]) => void;
  addBulletToExperience: (sectionId: string, itemId: string) => void;
  updateBullet: (sectionId: string, itemId: string, bulletId: string, text: string) => void;
  removeBullet: (sectionId: string, itemId: string, bulletId: string) => void;
  reorderBullets: (sectionId: string, itemId: string, orderedIds: string[]) => void;

  // Education mutations
  addEducationItem: (sectionId: string) => void;
  updateEducationItem: (sectionId: string, itemId: string, partial: Partial<EducationItem>) => void;
  removeEducationItem: (sectionId: string, itemId: string) => void;

  // Skills mutations
  addSkillGroup: (sectionId: string) => void;
  updateSkillGroup: (sectionId: string, groupId: string, partial: Partial<SkillGroup>) => void;
  removeSkillGroup: (sectionId: string, groupId: string) => void;

  // Projects mutations
  addProjectItem: (sectionId: string) => void;
  updateProjectItem: (sectionId: string, itemId: string, partial: Partial<ProjectItem>) => void;
  removeProjectItem: (sectionId: string, itemId: string) => void;
  reorderProjectItems: (sectionId: string, orderedIds: string[]) => void;
  addBulletToProject: (sectionId: string, itemId: string) => void;
  updateProjectBullet: (sectionId: string, itemId: string, bulletId: string, text: string) => void;
  removeProjectBullet: (sectionId: string, itemId: string, bulletId: string) => void;

  // Summary
  updateSummary: (sectionId: string, text: string) => void;

  // Certifications
  addCertification: (sectionId: string) => void;
  updateCertification: (sectionId: string, itemId: string, partial: Partial<CertificationItem>) => void;
  removeCertification: (sectionId: string, itemId: string) => void;

  // Awards
  addAward: (sectionId: string) => void;
  updateAward: (sectionId: string, itemId: string, partial: Partial<AwardItem>) => void;
  removeAward: (sectionId: string, itemId: string) => void;

  // Volunteering
  addVolunteering: (sectionId: string) => void;
  updateVolunteering: (sectionId: string, itemId: string, partial: Partial<VolunteeringItem>) => void;
  removeVolunteering: (sectionId: string, itemId: string) => void;

  // Languages
  addLanguage: (sectionId: string) => void;
  updateLanguage: (sectionId: string, itemId: string, partial: Partial<LanguageItem>) => void;
  removeLanguage: (sectionId: string, itemId: string) => void;

  // Courses
  addCourse: (sectionId: string) => void;
  updateCourse: (sectionId: string, itemId: string, partial: Partial<CourseItem>) => void;
  removeCourse: (sectionId: string, itemId: string) => void;

  // Achievements
  addAchievement: (sectionId: string) => void;
  updateAchievement: (sectionId: string, itemId: string, partial: Partial<AchievementItem>) => void;
  removeAchievement: (sectionId: string, itemId: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // ATS
  setATSJobDescription: (jd: string) => void;
  setATSResult: (result: ATSResult | null) => void;
  applyATSSuggestion: (suggestionId: string) => void;
  rejectATSSuggestion: (suggestionId: string) => void;

  // Import/Export
  importResume: (resume: Resume) => void;
  resetResume: () => void;
}

function pushHistory(past: HistoryEntry[], current: Resume, desc: string): HistoryEntry[] {
  const entry: HistoryEntry = { resume: JSON.parse(JSON.stringify(current)), timestamp: Date.now(), description: desc };
  return [...past.slice(-MAX_HISTORY + 1), entry];
}

function touch(resume: Resume): Resume {
  return { ...resume, meta: { ...resume.meta, updatedAt: new Date().toISOString() } };
}

const stored = loadFromStorage();

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: stored.resume,
  displaySettings: stored.displaySettings,
  past: [],
  future: [],
  currentPage: 'editor',
  atsResult: null,
  atsJobDescription: '',

  setPage: (page) => set({ currentPage: page }),

  updateDisplaySettings: (partial) =>
    set((s) => {
      const displaySettings = { ...s.displaySettings, ...partial };
      scheduleAutosave(s.resume, displaySettings);
      return { displaySettings };
    }),

  updateHeader: (header) =>
    set((s) => {
      const r = touch({ ...s.resume, header: { ...s.resume.header, ...header } });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update header'), future: [] };
    }),

  updateStyles: (styles) =>
    set((s) => {
      const r = touch({ ...s.resume, styles: { ...s.resume.styles, ...styles } });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update styles'), future: [] };
    }),

  applyTemplate: (templateId, styles) =>
    set((s) => {
      const r = touch({ ...s.resume, styles: { ...s.resume.styles, templateId, ...styles } });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, `Apply template ${templateId}`), future: [] };
    }),

  updateSection: (sectionId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => (sec.id === sectionId ? { ...sec, ...partial } : sec));
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update section'), future: [] };
    }),

  reorderSections: (orderedIds) =>
    set((s) => {
      const sectionMap = Object.fromEntries(s.resume.sections.map((sec) => [sec.id, sec]));
      const sections = orderedIds.map((id, i) => ({ ...sectionMap[id], order: i }));
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Reorder sections'), future: [] };
    }),

  toggleSection: (sectionId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
      );
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Toggle section'), future: [] };
    }),

  // Experience
  addExperienceItem: (sectionId) =>
    set((s) => {
      const newItem: ExperienceItem = {
        id: uuidv4(), company: '', role: '', startDate: '', endDate: '', current: false, location: '',
        employmentType: '', techStack: [], bullets: [],
      };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, newItem] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add experience'), future: [] };
    }),

  updateExperienceItem: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) => item.id === itemId ? { ...item, ...partial } : item),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update experience'), future: [] };
    }),

  removeExperienceItem: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove experience'), future: [] };
    }),

  reorderExperienceItems: (sectionId, orderedIds) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        const map = Object.fromEntries(sec.content.items.map((i) => [i.id, i]));
        return { ...sec, content: { ...sec.content, items: orderedIds.map((id) => map[id]) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Reorder experience'), future: [] };
    }),

  addBulletToExperience: (sectionId, itemId) =>
    set((s) => {
      const newBullet: BulletPoint = { id: uuidv4(), text: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId ? { ...item, bullets: [...item.bullets, newBullet] } : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add bullet'), future: [] };
    }),

  updateBullet: (sectionId, itemId, bulletId, text) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId
                ? { ...item, bullets: item.bullets.map((b) => b.id === bulletId ? { ...b, text } : b) }
                : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeBullet: (sectionId, itemId, bulletId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId ? { ...item, bullets: item.bullets.filter((b) => b.id !== bulletId) } : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove bullet'), future: [] };
    }),

  reorderBullets: (sectionId, itemId, orderedIds) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'experience') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) => {
              if (item.id !== itemId) return item;
              const map = Object.fromEntries(item.bullets.map((b) => [b.id, b]));
              return { ...item, bullets: orderedIds.map((id) => map[id]) };
            }),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  // Education
  addEducationItem: (sectionId) =>
    set((s) => {
      const newItem: EducationItem = { id: uuidv4(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', honors: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'education') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, newItem] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add education'), future: [] };
    }),

  updateEducationItem: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'education') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) => item.id === itemId ? { ...item, ...partial } : item),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update education'), future: [] };
    }),

  removeEducationItem: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'education') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove education'), future: [] };
    }),

  // Skills
  addSkillGroup: (sectionId) =>
    set((s) => {
      const newGroup: SkillGroup = { id: uuidv4(), category: '', skills: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'skills') return sec;
        return { ...sec, content: { ...sec.content, groups: [...sec.content.groups, newGroup] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add skill group'), future: [] };
    }),

  updateSkillGroup: (sectionId, groupId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'skills') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            groups: sec.content.groups.map((g) => g.id === groupId ? { ...g, ...partial } : g),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeSkillGroup: (sectionId, groupId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'skills') return sec;
        return { ...sec, content: { ...sec.content, groups: sec.content.groups.filter((g) => g.id !== groupId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove skill group'), future: [] };
    }),

  // Projects
  addProjectItem: (sectionId) =>
    set((s) => {
      const newItem: ProjectItem = { id: uuidv4(), name: '', description: '', techStack: '', url: '', githubUrl: '', liveUrl: '', role: '', startDate: '', endDate: '', bullets: [] };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, newItem] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add project'), future: [] };
    }),

  updateProjectItem: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) => item.id === itemId ? { ...item, ...partial } : item),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Update project'), future: [] };
    }),

  removeProjectItem: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove project'), future: [] };
    }),

  reorderProjectItems: (sectionId, orderedIds) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        const map = Object.fromEntries(sec.content.items.map((i) => [i.id, i]));
        return { ...sec, content: { ...sec.content, items: orderedIds.map((id) => map[id]) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  addBulletToProject: (sectionId, itemId) =>
    set((s) => {
      const newBullet: BulletPoint = { id: uuidv4(), text: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId ? { ...item, bullets: [...item.bullets, newBullet] } : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  updateProjectBullet: (sectionId, itemId, bulletId, text) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId
                ? { ...item, bullets: item.bullets.map((b) => b.id === bulletId ? { ...b, text } : b) }
                : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeProjectBullet: (sectionId, itemId, bulletId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'projects') return sec;
        return {
          ...sec,
          content: {
            ...sec.content,
            items: sec.content.items.map((item) =>
              item.id === itemId ? { ...item, bullets: item.bullets.filter((b) => b.id !== bulletId) } : item
            ),
          },
        };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  updateSummary: (sectionId, text) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'summary') return sec;
        return { ...sec, content: { type: 'summary' as const, text } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  // Undo/Redo
  undo: () =>
    set((s) => {
      if (s.past.length === 0) return s;
      const prev = s.past[s.past.length - 1];
      const newPast = s.past.slice(0, -1);
      const newFuture = [{ resume: JSON.parse(JSON.stringify(s.resume)), timestamp: Date.now(), description: 'redo' }, ...s.future];
      scheduleAutosave(prev.resume, s.displaySettings);
      return { resume: prev.resume, past: newPast, future: newFuture };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const newFuture = s.future.slice(1);
      const newPast = [...s.past, { resume: JSON.parse(JSON.stringify(s.resume)), timestamp: Date.now(), description: 'undo' }];
      scheduleAutosave(next.resume, s.displaySettings);
      return { resume: next.resume, past: newPast, future: newFuture };
    }),

  get canUndo() { return get().past.length > 0; },
  get canRedo() { return get().future.length > 0; },

  // ATS
  setATSJobDescription: (jd) => set({ atsJobDescription: jd }),
  setATSResult: (result) => set({ atsResult: result }),

  applyATSSuggestion: (suggestionId) =>
    set((s) => {
      if (!s.atsResult) return s;
      const suggestion = s.atsResult.suggestions.find((sg) => sg.id === suggestionId);
      if (!suggestion) return s;

      let newResume = JSON.parse(JSON.stringify(s.resume)) as Resume;
      const { sectionId, itemId, bulletId } = suggestion;

      newResume.sections = newResume.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (sec.content.type === 'summary' && suggestion.type === 'rewrite') {
          return { ...sec, content: { type: 'summary' as const, text: suggestion.suggestion } };
        }
        if (sec.content.type === 'experience' && itemId && bulletId) {
          return {
            ...sec,
            content: {
              ...sec.content,
              items: sec.content.items.map((item) =>
                item.id === itemId
                  ? { ...item, bullets: item.bullets.map((b) => b.id === bulletId ? { ...b, text: suggestion.suggestion } : b) }
                  : item
              ),
            },
          };
        }
        if (sec.content.type === 'projects' && itemId && bulletId) {
          return {
            ...sec,
            content: {
              ...sec.content,
              items: sec.content.items.map((item) =>
                item.id === itemId
                  ? { ...item, bullets: item.bullets.map((b) => b.id === bulletId ? { ...b, text: suggestion.suggestion } : b) }
                  : item
              ),
            },
          };
        }
        return sec;
      });

      newResume = touch(newResume);
      scheduleAutosave(newResume, s.displaySettings);

      const updatedSuggestions = s.atsResult.suggestions.map((sg) =>
        sg.id === suggestionId ? { ...sg, applied: true } : sg
      );

      return {
        resume: newResume,
        past: pushHistory(s.past, s.resume, 'Apply ATS suggestion'),
        future: [],
        atsResult: { ...s.atsResult, suggestions: updatedSuggestions },
      };
    }),

  rejectATSSuggestion: (suggestionId) =>
    set((s) => {
      if (!s.atsResult) return s;
      const updatedSuggestions = s.atsResult.suggestions.map((sg) =>
        sg.id === suggestionId ? { ...sg, rejected: true } : sg
      );
      return { atsResult: { ...s.atsResult, suggestions: updatedSuggestions } };
    }),

  // Import/Export
  importResume: (resume) =>
    set((s) => {
      saveToStorage(resume, s.displaySettings);
      return { resume, past: pushHistory(s.past, s.resume, 'Import resume'), future: [] };
    }),

  resetResume: () =>
    set((s) => {
      const { resume: fresh } = loadFromStorage();
      const reset: Resume = { ...fresh, meta: { ...fresh.meta, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      saveToStorage(reset, s.displaySettings);
      return { resume: reset, past: pushHistory(s.past, s.resume, 'Reset resume'), future: [] };
    }),

  // ── Certifications ──────────────────────────────────────────────────────────

  addCertification: (sectionId) =>
    set((s) => {
      const item: CertificationItem = { id: uuidv4(), name: '', issuer: '', date: '', expiry: '', url: '', credential: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'certifications') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add certification'), future: [] };
    }),

  updateCertification: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'certifications') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeCertification: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'certifications') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove certification'), future: [] };
    }),

  // ── Awards ──────────────────────────────────────────────────────────────────

  addAward: (sectionId) =>
    set((s) => {
      const item: AwardItem = { id: uuidv4(), title: '', organization: '', date: '', description: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'awards') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add award'), future: [] };
    }),

  updateAward: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'awards') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeAward: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'awards') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove award'), future: [] };
    }),

  // ── Volunteering ────────────────────────────────────────────────────────────

  addVolunteering: (sectionId) =>
    set((s) => {
      const item: VolunteeringItem = { id: uuidv4(), organization: '', role: '', startDate: '', endDate: '', current: false, description: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'volunteering') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add volunteering'), future: [] };
    }),

  updateVolunteering: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'volunteering') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeVolunteering: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'volunteering') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove volunteering'), future: [] };
    }),

  // ── Languages ───────────────────────────────────────────────────────────────

  addLanguage: (sectionId) =>
    set((s) => {
      const item: LanguageItem = { id: uuidv4(), language: '', proficiency: 'Intermediate' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'languages') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add language'), future: [] };
    }),

  updateLanguage: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'languages') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeLanguage: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'languages') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove language'), future: [] };
    }),

  // ── Courses ─────────────────────────────────────────────────────────────────

  addCourse: (sectionId) =>
    set((s) => {
      const item: CourseItem = { id: uuidv4(), name: '', institution: '', date: '', url: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'courses') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add course'), future: [] };
    }),

  updateCourse: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'courses') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeCourse: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'courses') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove course'), future: [] };
    }),

  // ── Achievements ────────────────────────────────────────────────────────────

  addAchievement: (sectionId) =>
    set((s) => {
      const item: AchievementItem = { id: uuidv4(), title: '', date: '', description: '' };
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'achievements') return sec;
        return { ...sec, content: { ...sec.content, items: [...sec.content.items, item] } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Add achievement'), future: [] };
    }),

  updateAchievement: (sectionId, itemId, partial) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'achievements') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.map((i) => i.id === itemId ? { ...i, ...partial } : i) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r };
    }),

  removeAchievement: (sectionId, itemId) =>
    set((s) => {
      const sections = s.resume.sections.map((sec) => {
        if (sec.id !== sectionId || sec.content.type !== 'achievements') return sec;
        return { ...sec, content: { ...sec.content, items: sec.content.items.filter((i) => i.id !== itemId) } };
      });
      const r = touch({ ...s.resume, sections });
      scheduleAutosave(r, s.displaySettings);
      return { resume: r, past: pushHistory(s.past, s.resume, 'Remove achievement'), future: [] };
    }),
}));


