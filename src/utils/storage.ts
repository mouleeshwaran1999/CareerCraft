// File: src/utils/storage.ts
import type { Resume, DisplaySettings } from '../types/resume';
import { SAMPLE_RESUME } from '../data/sampleResume';
import {
  STORAGE_KEY,
  STORAGE_KEY_V1_LEGACY,
  STORAGE_KEY_V2_LEGACY,
} from '../config/appConfig';

// Re-export so existing callers (e.g. tests) don't break
export const STORAGE_KEY_V1 = STORAGE_KEY_V1_LEGACY;
export const STORAGE_KEY_V2 = STORAGE_KEY_V2_LEGACY;

export interface StoragePayload {
  resume: Resume;
  displaySettings: DisplaySettings;
  savedAt: number;
}

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  showPhoto: false,
  showIcons: true,
  showBackground: false,
  atsFriendlyMode: false,
};

function migrateHeader(old: Record<string, string>): Resume['header'] {
  return {
    name: old.name ?? '',
    title: old.title ?? '',
    tagline: old.tagline ?? '',
    email: old.email ?? '',
    phone: old.phone ?? '',
    location: old.location ?? '',
    website: old.website ?? '',
    linkedin: old.linkedin ?? '',
    github: old.github ?? '',
    photo: old.photo ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateSection(sec: any): Resume['sections'][0] {
  const content = sec.content ?? sec;
  if (content.type === 'experience' && Array.isArray(content.items)) {
    return {
      ...sec,
      content: {
        ...content,
        items: content.items.map((item: Record<string, unknown>) => ({
          employmentType: '',
          techStack: [] as string[],
          ...item,
        })),
      },
    };
  }
  if (content.type === 'projects' && Array.isArray(content.items)) {
    return {
      ...sec,
      content: {
        ...content,
        items: content.items.map((item: Record<string, unknown>) => ({
          githubUrl: '',
          liveUrl: '',
          role: '',
          ...item,
        })),
      },
    };
  }
  return sec;
}

function migrateV1ToV2(v1Resume: Record<string, unknown>): Resume {
  const meta = (v1Resume.meta ?? {}) as Record<string, unknown>;
  const sections = Array.isArray(v1Resume.sections) ? v1Resume.sections : [];
  return {
    meta: {
      version: 2,
      createdAt: (meta.createdAt as string) ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: (meta.title as string) ?? 'My Resume',
    },
    header: migrateHeader((v1Resume.header ?? {}) as Record<string, string>),
    sections: sections.map(migrateSection),
    styles: (v1Resume.styles ?? {}) as Resume['styles'],
  };
}

export function saveToStorage(resume: Resume, displaySettings: DisplaySettings): void {
  try {
    const payload: StoragePayload = { resume, displaySettings, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded — silently ignore
  }
}

export function loadFromStorage(): { resume: Resume; displaySettings: DisplaySettings } {
  // 1. Try the current CareerCraft key
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoragePayload>;
      if (parsed?.resume?.meta) {
        return {
          resume: parsed.resume,
          displaySettings: { ...DEFAULT_DISPLAY_SETTINGS, ...(parsed.displaySettings ?? {}) },
        };
      }
    }
  } catch { /* fall through */ }

  // 2. Migrate from legacy V2 key (resume_builder_v2)
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2_LEGACY);
    if (rawV2) {
      const parsedV2 = JSON.parse(rawV2) as Partial<StoragePayload>;
      if (parsedV2?.resume?.meta) {
        const result = {
          resume: parsedV2.resume,
          displaySettings: { ...DEFAULT_DISPLAY_SETTINGS, ...(parsedV2.displaySettings ?? {}) },
        };
        // Promote to new key
        saveToStorage(result.resume, result.displaySettings);
        return result;
      }
    }
  } catch { /* fall through */ }

  // 3. Migrate from original V1 key (resume_builder_v1)
  try {
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1_LEGACY);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1) as { resume: Record<string, unknown> };
      if (parsedV1?.resume?.meta) {
        const migrated = migrateV1ToV2(parsedV1.resume);
        saveToStorage(migrated, DEFAULT_DISPLAY_SETTINGS);
        return { resume: migrated, displaySettings: DEFAULT_DISPLAY_SETTINGS };
      }
    }
  } catch { /* fall through */ }

  return { resume: SAMPLE_RESUME, displaySettings: DEFAULT_DISPLAY_SETTINGS };
}
