// File: src/types/resume.ts

export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'volunteering'
  | 'languages'
  | 'courses'
  | 'achievements'
  | 'custom';

export interface ResumeHeader {
  name: string;
  title: string;
  tagline: string;       // NEW: subtitle / tagline
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string;         // NEW: base64 data URL or '' for none
}

export interface BulletPoint {
  id: string;
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  employmentType: string;  // NEW: Full-time | Part-time | Contract | Freelance | Internship
  techStack: string[];     // NEW: tech stack array
  bullets: BulletPoint[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string;
  url: string;
  githubUrl: string;   // NEW
  liveUrl: string;     // NEW
  role: string;        // NEW: your role in the project
  startDate: string;
  endDate: string;
  bullets: BulletPoint[];
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  url: string;
  credential: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface VolunteeringItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface CourseItem {
  id: string;
  name: string;
  institution: string;
  date: string;
  url: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

export type SectionContent =
  | { type: 'summary'; text: string }
  | { type: 'experience'; items: ExperienceItem[] }
  | { type: 'education'; items: EducationItem[] }
  | { type: 'skills'; groups: SkillGroup[] }
  | { type: 'projects'; items: ProjectItem[] }
  | { type: 'certifications'; items: CertificationItem[] }
  | { type: 'awards'; items: AwardItem[] }
  | { type: 'volunteering'; items: VolunteeringItem[] }
  | { type: 'languages'; items: LanguageItem[] }
  | { type: 'courses'; items: CourseItem[] }
  | { type: 'achievements'; items: AchievementItem[] }
  | { type: 'custom'; title: string; items: CustomItem[] };

export interface ResumeSection {
  id: string;
  type: SectionType;
  label: string;
  enabled: boolean;
  order: number;
  content: SectionContent;
}

export type SpacingScale = 'compact' | 'normal' | 'relaxed';
export type LayoutColumns = 1 | 2;

export interface ResumeStyles {
  templateId: string;
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  accentColor: string;
  spacing: SpacingScale;
  columns: LayoutColumns;
}

// NEW: Display / feature flags stored alongside resume
export interface DisplaySettings {
  showPhoto: boolean;
  showIcons: boolean;
  showBackground: boolean;
  atsFriendlyMode: boolean;
}

export interface ResumeMeta {
  version: number;
  createdAt: string;
  updatedAt: string;
  title: string;
}
export interface Resume {
  meta: ResumeMeta;
  header: ResumeHeader;
  sections: ResumeSection[];
  styles: ResumeStyles;
}

// ATS types
export interface ATSKeywordMatch {
  keyword: string;
  found: boolean;
  occurrences: number;
}

export interface ATSSuggestion {
  id: string;
  type: 'rewrite' | 'add' | 'remove' | 'format';
  sectionId: string;
  itemId?: string;
  bulletId?: string;
  original: string;
  suggestion: string;
  reason: string;
  applied: boolean;
  rejected: boolean;
}

export interface ATSBreakdown {
  keywordScore: number;
  completenessScore: number;
  readabilityScore: number;
  formattingScore: number;
}

export interface ATSResult {
  totalScore: number;
  breakdown: ATSBreakdown;
  missingKeywords: string[];
  matchedKeywords: ATSKeywordMatch[];
  suggestions: ATSSuggestion[];
  warnings: string[];
  analyzedAt: string;
}

// Template types
export type TemplateCategory = 'modern' | 'classic' | 'minimal' | 'tech' | 'elegant' | 'ats' | 'creative' | 'executive';
export type TemplateLayout = 'single' | 'sidebar-left' | 'sidebar-right' | 'banner';
export type HeaderVariant = 'left' | 'centered' | 'banner' | 'compact';
export type SectionStyle = 'underline' | 'icon-led' | 'filled-bar' | 'dot-rule' | 'minimal';

export interface TemplateTokens {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  sidebarBg: string;
  sidebarText: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: number;
}

/** V1 legacy template definition – kept for backward compat */
export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'minimal' | 'tech' | 'elegant';
  description: string;
  defaultStyles: Partial<ResumeStyles>;
  supportsColumns: boolean;
  tags: string[];
}

/** V2 – config-driven, rendered by TemplateRenderer */
export interface TemplateDefinitionV2 {
  version: 2;
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  isAtsFriendly: boolean;
  tags: string[];
  flags: {
    supportsPhoto: boolean;
    supportsIcons: boolean;
    supportsBackgroundPattern: boolean;
    supportsColumns: boolean;
  };
  layout: TemplateLayout;
  headerVariant: HeaderVariant;
  sectionStyle: SectionStyle;
  tokens: TemplateTokens;
  /** Sections that go in the sidebar (for sidebar layouts) */
  sidebarSections?: SectionType[];
  /** Default styles to apply when selected */
  defaultStyles: Partial<ResumeStyles>;
}

// History for undo/redo
export interface HistoryEntry {
  resume: Resume;
  timestamp: number;
  description: string;
}
