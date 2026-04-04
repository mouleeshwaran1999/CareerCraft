// File: src/templates/TemplateRenderer.tsx
import React from 'react';
import type {
  Resume,
  ResumeSection,
  TemplateDefinitionV2,
  DisplaySettings,
  SectionType,
  ExperienceItem,
  ProjectItem,
} from '../types/resume';
import { iconInnerHTML, PHOTO_PLACEHOLDER_DATA_URL } from './assets/icons';
import type { IconName } from './assets/icons';
import { getPatternCss } from './assets/patterns';
import { formatDateRange } from '../components/preview/templateUtils';

// ─── Section Icon Map ─────────────────────────────────────────────────────────

const SECTION_ICONS: Partial<Record<SectionType, IconName>> = {
  summary: 'summary',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certificate',
  awards: 'award',
  volunteering: 'volunteer',
  languages: 'language',
  courses: 'course',
  achievements: 'achievement',
};

// ─── Token utilities ──────────────────────────────────────────────────────────

type Tok = TemplateDefinitionV2['tokens'];

function spacing(tok: Tok, scale: string | undefined): React.CSSProperties {
  const gap = scale === 'compact' ? 10 : scale === 'relaxed' ? 22 : 15;
  return { marginBottom: gap };
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({
  label, type, tok, style, showIcons, inSidebar,
}: {
  label: string;
  type: SectionType;
  tok: Tok;
  style: TemplateDefinitionV2['sectionStyle'];
  showIcons: boolean;
  inSidebar: boolean;
}) {
  const iconName = SECTION_ICONS[type] ?? 'summary';
  const color = inSidebar ? tok.sidebarText : tok.primaryColor;

  const icon = showIcons ? (
    <span
      style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', marginRight: 6, flexShrink: 0 }}
      dangerouslySetInnerHTML={iconInnerHTML(iconName, 15, color)}
    />
  ) : null;

  if (style === 'filled-bar') {
    return (
      <div style={{
        background: inSidebar ? (tok.sidebarText + '20') : (tok.primaryColor + '15'),
        borderLeft: `3px solid ${color}`,
        padding: '4px 10px', borderRadius: '0 4px 4px 0',
        marginBottom: 8, display: 'flex', alignItems: 'center',
      }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: tok.fontSize * 0.88, textTransform: 'uppercase', letterSpacing: '0.07em', color }}>{label}</span>
      </div>
    );
  }

  if (style === 'icon-led') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span dangerouslySetInnerHTML={iconInnerHTML(iconName, 13, color)} />
        </div>
        <span style={{ fontWeight: 700, fontSize: tok.fontSize * 0.9, textTransform: 'uppercase', letterSpacing: '0.08em', color }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: color + '30' }} />
      </div>
    );
  }

  if (style === 'dot-rule') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontWeight: 700, fontSize: tok.fontSize * 0.88, textTransform: 'uppercase', letterSpacing: '0.1em', color }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: color + '30' }} />
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: tok.fontSize * 0.75, fontWeight: 600, color: tok.mutedColor, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</span>
      </div>
    );
  }

  // default: underline
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: `2px solid ${color}`, paddingBottom: 3, marginBottom: 8 }}>
      {icon}
      <span style={{ fontWeight: 700, fontSize: tok.fontSize * 0.9, textTransform: 'uppercase', letterSpacing: '0.07em', color }}>{label}</span>
    </div>
  );
}

// ─── Section Content Renderers ────────────────────────────────────────────────

function renderSummary(text: string, tok: Tok, inSidebar: boolean) {
  return <p style={{ margin: 0, lineHeight: 1.65, color: inSidebar ? tok.sidebarText + 'cc' : tok.textColor, fontSize: tok.fontSize }}>{text}</p>;
}

function renderExperience(items: ExperienceItem[], tok: Tok, isTimeline: boolean, atsFriendly: boolean) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item) => (
        <div key={item.id} style={{ position: 'relative', paddingLeft: isTimeline && !atsFriendly ? 20 : 0 }}>
          {isTimeline && !atsFriendly && (
            <>
              <div style={{ position: 'absolute', left: 6, top: 6, width: 9, height: 9, borderRadius: '50%', background: tok.primaryColor, border: `2px solid ${tok.bgColor}`, boxShadow: `0 0 0 2px ${tok.primaryColor}` }} />
              <div style={{ position: 'absolute', left: 9, top: 16, bottom: -12, width: 2, background: tok.accentColor + '50' }} />
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: tok.fontSize, color: tok.textColor }}>{item.role}</span>
              {item.company && <span style={{ color: tok.primaryColor, fontSize: tok.fontSize }}> · {item.company}</span>}
              {item.employmentType && !atsFriendly && (
                <span style={{ fontSize: tok.fontSize * 0.78, color: tok.mutedColor, marginLeft: 6, background: tok.accentColor + '18', borderRadius: 3, padding: '1px 5px' }}>{item.employmentType}</span>
              )}
            </div>
            <span style={{ fontSize: tok.fontSize * 0.82, color: tok.mutedColor, whiteSpace: 'nowrap' }}>
              {item.location && `${item.location}  `}
              {formatDateRange(item.startDate, item.endDate, item.current)}
            </span>
          </div>
          {item.techStack && item.techStack.length > 0 && !atsFriendly && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, margin: '3px 0' }}>
              {item.techStack.map((t, i) => (
                <span key={i} style={{ fontSize: tok.fontSize * 0.75, background: tok.accentColor + '20', color: tok.primaryColor, border: `1px solid ${tok.accentColor}40`, borderRadius: 3, padding: '1px 5px' }}>{t}</span>
              ))}
            </div>
          )}
          {item.techStack && item.techStack.length > 0 && atsFriendly && (
            <div style={{ fontSize: tok.fontSize * 0.85, color: tok.mutedColor, marginTop: 1 }}>
              Tech: {item.techStack.join(', ')}
            </div>
          )}
          <ul style={{ margin: '4px 0 0 14px', padding: 0, listStyle: 'disc' }}>
            {item.bullets.map((b) => (
              <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.55, color: tok.textColor + 'dd', fontSize: tok.fontSize }}>{b.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function renderEducation(items: Resume['sections'][0]['content'] & { type: 'education' }, tok: Tok) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontWeight: 600, color: tok.textColor, fontSize: tok.fontSize }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
            <span style={{ fontSize: tok.fontSize * 0.82, color: tok.mutedColor }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
          </div>
          <div style={{ color: tok.primaryColor, fontSize: tok.fontSize * 0.92 }}>{item.institution}</div>
          {(item.gpa || item.honors) && (
            <div style={{ fontSize: tok.fontSize * 0.82, color: tok.mutedColor }}>{item.gpa && `GPA: ${item.gpa}`}{item.honors && ` · ${item.honors}`}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderSkills(groups: { id: string; category: string; skills: string }[], tok: Tok, asChips: boolean, inSidebar: boolean, showBars: boolean, atsFriendly: boolean) {
  if (showBars && !atsFriendly) {
    // Skill bars (infographic mode) – only when not ATS
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.map((g) => (
          <div key={g.id}>
            {g.category && <div style={{ fontSize: tok.fontSize * 0.82, fontWeight: 600, color: inSidebar ? tok.sidebarText : tok.primaryColor, marginBottom: 4 }}>{g.category}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {g.skills.split(',').map((sk, i) => {
                const rand = 60 + ((sk.charCodeAt(0) + i * 7) % 40);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: tok.fontSize * 0.85, color: inSidebar ? tok.sidebarText : tok.textColor, minWidth: 80, flexShrink: 0 }}>{sk.trim()}</span>
                    <div style={{ flex: 1, height: 5, background: inSidebar ? tok.sidebarText + '30' : tok.accentColor + '30', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${rand}%`, height: '100%', background: inSidebar ? tok.sidebarText : tok.accentColor, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (asChips && !atsFriendly) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {groups.map((g) => (
          <div key={g.id}>
            {g.category && <div style={{ fontSize: tok.fontSize * 0.82, fontWeight: 600, color: inSidebar ? tok.sidebarText : tok.primaryColor, marginBottom: 4 }}>{g.category}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {g.skills.split(',').map((sk, i) => (
                <span key={i} style={{ fontSize: tok.fontSize * 0.82, background: inSidebar ? tok.sidebarText + '20' : tok.accentColor + '18', color: inSidebar ? tok.sidebarText : tok.primaryColor, border: `1px solid ${inSidebar ? tok.sidebarText + '40' : tok.accentColor + '40'}`, borderRadius: 4, padding: '1px 6px' }}>{sk.trim()}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Plain text (ATS-friendly)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {groups.map((g) => (
        <div key={g.id} style={{ display: 'flex', gap: 8 }}>
          {g.category && <span style={{ fontWeight: 600, color: inSidebar ? tok.sidebarText : tok.primaryColor, minWidth: 90, fontSize: tok.fontSize * 0.9, flexShrink: 0 }}>{g.category}:</span>}
          <span style={{ color: inSidebar ? tok.sidebarText + 'cc' : tok.textColor, fontSize: tok.fontSize * 0.9 }}>{g.skills}</span>
        </div>
      ))}
    </div>
  );
}

function renderProjects(items: ProjectItem[], tok: Tok, asCards: boolean, atsFriendly: boolean) {
  if (asCards && !atsFriendly) {
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: `1px solid ${tok.accentColor}40`, borderRadius: 8, padding: '10px 12px', background: tok.accentColor + '06' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: tok.primaryColor, fontSize: tok.fontSize }}>{item.name}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {item.githubUrl && <span style={{ fontSize: tok.fontSize * 0.78, color: tok.primaryColor }}>GitHub ↗</span>}
                {item.liveUrl && <span style={{ fontSize: tok.fontSize * 0.78, color: tok.primaryColor }}>Demo ↗</span>}
              </div>
            </div>
            {item.techStack && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 5 }}>
                {item.techStack.split(',').map((t, i) => (
                  <span key={i} style={{ fontSize: tok.fontSize * 0.76, background: tok.primaryColor + '12', color: tok.primaryColor, borderRadius: 3, padding: '1px 5px' }}>{t.trim()}</span>
                ))}
              </div>
            )}
            {item.description && <p style={{ margin: '0 0 4px', fontSize: tok.fontSize * 0.88, color: tok.textColor + 'cc', lineHeight: 1.5 }}>{item.description}</p>}
            <ul style={{ margin: '4px 0 0 12px', padding: 0, listStyle: 'disc' }}>
              {item.bullets.map((b) => <li key={b.id} style={{ fontSize: tok.fontSize * 0.9, color: tok.textColor + 'dd', lineHeight: 1.5, marginBottom: 2 }}>{b.text}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontWeight: 700, color: tok.primaryColor, fontSize: tok.fontSize }}>{item.name}</span>
            <span style={{ fontSize: tok.fontSize * 0.82, color: tok.mutedColor }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
          </div>
          {item.role && <div style={{ fontSize: tok.fontSize * 0.88, color: tok.mutedColor, fontStyle: 'italic' }}>Role: {item.role}</div>}
          {item.techStack && <div style={{ fontSize: tok.fontSize * 0.85, color: tok.accentColor, fontStyle: 'italic' }}>{item.techStack}</div>}
          {item.description && <p style={{ margin: '2px 0 4px', fontSize: tok.fontSize * 0.9, color: tok.textColor + 'cc', lineHeight: 1.5 }}>{item.description}</p>}
          <ul style={{ margin: '2px 0 0 14px', padding: 0, listStyle: 'disc' }}>
            {item.bullets.map((b) => <li key={b.id} style={{ fontSize: tok.fontSize, color: tok.textColor + 'dd', lineHeight: 1.5, marginBottom: 2 }}>{b.text}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function renderCertifications(items: NonNullable<Extract<ResumeSection['content'], { type: 'certifications' }>['items']>, tok: Tok, inSidebar: boolean) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ fontWeight: 600, fontSize: tok.fontSize * 0.92, color: inSidebar ? tok.sidebarText : tok.textColor }}>{item.name}</div>
          <div style={{ fontSize: tok.fontSize * 0.82, color: inSidebar ? tok.sidebarText + '99' : tok.mutedColor }}>
            {item.issuer}{item.date && ` · ${item.date}`}{item.expiry && ` → ${item.expiry}`}
          </div>
          {item.credential && <div style={{ fontSize: tok.fontSize * 0.78, color: inSidebar ? tok.accentColor : tok.accentColor, fontStyle: 'italic' }}>ID: {item.credential}</div>}
        </div>
      ))}
    </div>
  );
}

function renderAwards(items: NonNullable<Extract<ResumeSection['content'], { type: 'awards' }>['items']>, tok: Tok, inSidebar: boolean) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <span style={{ fontWeight: 600, fontSize: tok.fontSize * 0.92, color: inSidebar ? tok.sidebarText : tok.textColor }}>{item.title}</span>
            {item.date && <span style={{ fontSize: tok.fontSize * 0.8, color: inSidebar ? tok.sidebarText + '80' : tok.mutedColor }}>{item.date}</span>}
          </div>
          {item.organization && <div style={{ fontSize: tok.fontSize * 0.82, color: inSidebar ? tok.sidebarText + '99' : tok.mutedColor }}>{item.organization}</div>}
          {item.description && <div style={{ fontSize: tok.fontSize * 0.85, color: inSidebar ? tok.sidebarText + 'cc' : tok.textColor + 'cc', lineHeight: 1.5 }}>{item.description}</div>}
        </div>
      ))}
    </div>
  );
}

function renderVolunteering(items: NonNullable<Extract<ResumeSection['content'], { type: 'volunteering' }>['items']>, tok: Tok) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontWeight: 600, fontSize: tok.fontSize, color: tok.textColor }}>{item.role} · {item.organization}</span>
            <span style={{ fontSize: tok.fontSize * 0.82, color: tok.mutedColor }}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
          </div>
          {item.description && <p style={{ margin: '2px 0 0', fontSize: tok.fontSize * 0.9, color: tok.textColor + 'cc', lineHeight: 1.55 }}>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

function renderLanguages(items: NonNullable<Extract<ResumeSection['content'], { type: 'languages' }>['items']>, tok: Tok, inSidebar: boolean) {
  const proficiency = { Native: 5, Fluent: 4, Advanced: 3, Intermediate: 2, Basic: 1 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: tok.fontSize * 0.9, color: inSidebar ? tok.sidebarText : tok.textColor, fontWeight: 500 }}>{item.language}</span>
          <span style={{ fontSize: tok.fontSize * 0.78, color: inSidebar ? tok.sidebarText + '99' : tok.mutedColor, fontStyle: 'italic' }}>{item.proficiency}</span>
        </div>
      ))}
    </div>
  );
}

function renderCourses(items: NonNullable<Extract<ResumeSection['content'], { type: 'courses' }>['items']>, tok: Tok, inSidebar: boolean) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item) => (
        <div key={item.id}>
          <span style={{ fontWeight: 600, fontSize: tok.fontSize * 0.9, color: inSidebar ? tok.sidebarText : tok.textColor }}>{item.name}</span>
          <span style={{ fontSize: tok.fontSize * 0.82, color: inSidebar ? tok.sidebarText + '80' : tok.mutedColor }}> · {item.institution}{item.date && `, ${item.date}`}</span>
        </div>
      ))}
    </div>
  );
}

function renderAchievements(items: NonNullable<Extract<ResumeSection['content'], { type: 'achievements' }>['items']>, tok: Tok, inSidebar: boolean) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <span style={{ fontWeight: 600, fontSize: tok.fontSize * 0.9, color: inSidebar ? tok.sidebarText : tok.textColor }}>{item.title}</span>
            {item.date && <span style={{ fontSize: tok.fontSize * 0.78, color: inSidebar ? tok.sidebarText + '80' : tok.mutedColor }}>{item.date}</span>}
          </div>
          {item.description && <div style={{ fontSize: tok.fontSize * 0.85, color: inSidebar ? tok.sidebarText + 'cc' : tok.textColor + 'cc', lineHeight: 1.5 }}>{item.description}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Render a single section ──────────────────────────────────────────────────

function RenderSection({
  section, tok, tpl, displaySettings, inSidebar,
}: {
  section: ResumeSection;
  tok: Tok;
  tpl: TemplateDefinitionV2;
  displaySettings: DisplaySettings;
  inSidebar: boolean;
}) {
  const { atsFriendlyMode, showIcons } = displaySettings;
  const effectiveStyle: TemplateDefinitionV2['sectionStyle'] = atsFriendlyMode ? 'underline' : tpl.sectionStyle;
  const isTimeline = tpl.id === 'timeline-pro';
  const asCards = tpl.id === 'card-modern';
  const showBars = tpl.id === 'infographic-lite';
  const asChips = ['elegant-sidebar', 'card-modern', 'two-col-accent', 'dark-header', 'gradient-accent'].includes(tpl.id);

  const c = section.content;
  let body: React.ReactNode = null;

  if (c.type === 'summary') body = renderSummary(c.text, tok, inSidebar);
  else if (c.type === 'experience') body = renderExperience(c.items, tok, isTimeline, atsFriendlyMode);
  else if (c.type === 'education') body = renderEducation(c, tok);
  else if (c.type === 'skills') body = renderSkills(c.groups, tok, asChips, inSidebar, showBars, atsFriendlyMode);
  else if (c.type === 'projects') body = renderProjects(c.items, tok, asCards, atsFriendlyMode);
  else if (c.type === 'certifications') body = renderCertifications(c.items, tok, inSidebar);
  else if (c.type === 'awards') body = renderAwards(c.items, tok, inSidebar);
  else if (c.type === 'volunteering') body = renderVolunteering(c.items, tok);
  else if (c.type === 'languages') body = renderLanguages(c.items, tok, inSidebar);
  else if (c.type === 'courses') body = renderCourses(c.items, tok, inSidebar);
  else if (c.type === 'achievements') body = renderAchievements(c.items, tok, inSidebar);

  if (body === null) return null;

  return (
    <div>
      <SectionHeading
        label={section.label}
        type={section.type}
        tok={tok}
        style={effectiveStyle}
        showIcons={showIcons && tpl.flags.supportsIcons && !atsFriendlyMode}
        inSidebar={inSidebar}
      />
      {body}
    </div>
  );
}

// ─── Header Renderers ─────────────────────────────────────────────────────────

function renderContactLine(header: Resume['header'], tok: Tok, showIcons: boolean, atsFriendly: boolean, invert: boolean) {
  const muted = invert ? '#ffffff99' : tok.mutedColor;
  const items = [
    { key: 'email', value: header.email, icon: 'email' as IconName },
    { key: 'phone', value: header.phone, icon: 'phone' as IconName },
    { key: 'location', value: header.location, icon: 'location' as IconName },
    { key: 'linkedin', value: header.linkedin, icon: 'linkedin' as IconName },
    { key: 'github', value: header.github, icon: 'github' as IconName },
    { key: 'website', value: header.website, icon: 'website' as IconName },
  ].filter((i) => i.value);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px', fontSize: tok.fontSize * 0.83, color: muted, marginTop: 6 }}>
      {items.map((item) => (
        <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showIcons && !atsFriendly && (
            <span dangerouslySetInnerHTML={iconInnerHTML(item.icon, 12, muted)} />
          )}
          {item.value}
        </span>
      ))}
    </div>
  );
}

function LeftHeader({ resume, tok, displaySettings, tpl }: { resume: Resume; tok: Tok; displaySettings: DisplaySettings; tpl: TemplateDefinitionV2 }) {
  const { header } = resume;
  const { showPhoto, showIcons, atsFriendlyMode } = displaySettings;
  const showPhotoActual = showPhoto && tpl.flags.supportsPhoto;

  return (
    <div style={{ padding: '24px 32px 18px', background: tok.bgColor, borderBottom: `3px solid ${tok.primaryColor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {showPhotoActual && (
          <img
            src={header.photo || PHOTO_PLACEHOLDER_DATA_URL}
            alt={header.name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${tok.accentColor}` }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: tok.fontSize * 1.9, fontWeight: 700, color: tok.textColor, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: tok.headingFont }}>{header.name || 'Your Name'}</div>
          {header.title && <div style={{ fontSize: tok.fontSize * 1.05, color: tok.primaryColor, marginTop: 2, fontWeight: 500 }}>{header.title}</div>}
          {header.tagline && <div style={{ fontSize: tok.fontSize * 0.9, color: tok.mutedColor, marginTop: 1, fontStyle: 'italic' }}>{header.tagline}</div>}
          {renderContactLine(header, tok, showIcons, atsFriendlyMode, false)}
        </div>
      </div>
    </div>
  );
}

function CenteredHeader({ resume, tok, displaySettings, tpl }: { resume: Resume; tok: Tok; displaySettings: DisplaySettings; tpl: TemplateDefinitionV2 }) {
  const { header } = resume;
  const { showIcons, atsFriendlyMode } = displaySettings;

  return (
    <div style={{ padding: '28px 40px 18px', textAlign: 'center', borderBottom: `2px solid ${tok.primaryColor}`, background: tok.bgColor }}>
      <div style={{ fontSize: tok.fontSize * 2.1, fontWeight: 700, color: tok.textColor, fontFamily: tok.headingFont, letterSpacing: '0.02em', lineHeight: 1.1 }}>{header.name || 'Your Name'}</div>
      {header.title && <div style={{ fontSize: tok.fontSize * 1.1, color: tok.primaryColor, marginTop: 4, fontStyle: tok.headingFont.includes('Georgia') ? 'italic' : 'normal' }}>{header.title}</div>}
      {header.tagline && <div style={{ fontSize: tok.fontSize * 0.9, color: tok.mutedColor, marginTop: 2, fontStyle: 'italic' }}>{header.tagline}</div>}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderContactLine(header, tok, showIcons, atsFriendlyMode, false)}
      </div>
    </div>
  );
}

function BannerHeader({ resume, tok, displaySettings, tpl }: { resume: Resume; tok: Tok; displaySettings: DisplaySettings; tpl: TemplateDefinitionV2 }) {
  const { header } = resume;
  const { showPhoto, showIcons, atsFriendlyMode } = displaySettings;
  const showPhotoActual = showPhoto && tpl.flags.supportsPhoto;
  const isDark = tok.primaryColor.startsWith('#0') || tok.primaryColor === '#0f172a' || tok.primaryColor === '#1e40af' || tok.primaryColor === '#431407';

  return (
    <div style={{ padding: '24px 32px 20px', background: tok.primaryColor }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {showPhotoActual && (
          <img
            src={header.photo || PHOTO_PLACEHOLDER_DATA_URL}
            alt={header.name}
            style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: tok.fontSize * 2, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1, fontFamily: tok.headingFont }}>{header.name || 'Your Name'}</div>
          {header.title && <div style={{ fontSize: tok.fontSize * 1.05, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>{header.title}</div>}
          {header.tagline && <div style={{ fontSize: tok.fontSize * 0.88, color: 'rgba(255,255,255,0.65)', marginTop: 1, fontStyle: 'italic' }}>{header.tagline}</div>}
          {renderContactLine(header, tok, showIcons, atsFriendlyMode, true)}
        </div>
      </div>
    </div>
  );
}

function CompactHeader({ resume, tok, displaySettings, tpl }: { resume: Resume; tok: Tok; displaySettings: DisplaySettings; tpl: TemplateDefinitionV2 }) {
  const { header } = resume;
  const { showIcons, atsFriendlyMode } = displaySettings;
  return (
    <div style={{ padding: '30px 48px 20px', background: tok.bgColor, marginBottom: 4 }}>
      <div style={{ fontSize: tok.fontSize * 2, fontWeight: 300, letterSpacing: '-0.03em', color: tok.textColor, fontFamily: tok.headingFont }}>{header.name || 'Your Name'}</div>
      {header.title && <div style={{ fontSize: tok.fontSize * 1.05, color: tok.mutedColor, marginTop: 2 }}>{header.title}</div>}
      {header.tagline && <div style={{ fontSize: tok.fontSize * 0.9, color: tok.mutedColor, marginTop: 1, fontStyle: 'italic' }}>{header.tagline}</div>}
      {renderContactLine(header, tok, showIcons, atsFriendlyMode, false)}
    </div>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────

interface TemplateRendererProps {
  resume: Resume;
  tpl: TemplateDefinitionV2;
  displaySettings: DisplaySettings;
}

export default function TemplateRenderer({ resume, tpl, displaySettings }: TemplateRendererProps) {
  const { showBackground, atsFriendlyMode } = displaySettings;
  const tok = { ...tpl.tokens };

  // Apply user color/font overrides if they differ from defaults
  if (resume.styles.primaryColor) tok.primaryColor = resume.styles.primaryColor;
  if (resume.styles.accentColor) tok.accentColor = resume.styles.accentColor;
  if (resume.styles.fontFamily) { tok.fontFamily = `${resume.styles.fontFamily}, sans-serif`; tok.headingFont = tok.fontFamily; }
  if (resume.styles.fontSize) tok.fontSize = resume.styles.fontSize;

  const sortedSections = [...resume.sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  // ATS mode overrides
  const effectiveLayout: TemplateDefinitionV2['layout'] = (atsFriendlyMode && !tpl.isAtsFriendly) ? 'single' : tpl.layout;
  const showBgPattern = showBackground && tpl.flags.supportsBackgroundPattern && !atsFriendlyMode;

  const spacingGap = resume.styles.spacing === 'compact' ? 12 : resume.styles.spacing === 'relaxed' ? 22 : 16;

  // Background pattern
  const bgPattern = showBgPattern
    ? getPatternCss('dots', tok.accentColor, 0.3)
    : 'none';

  // Sidebar section split
  const sidebarTypes = new Set<string>(tpl.sidebarSections ?? ['skills', 'languages', 'certifications', 'awards', 'achievements']);
  const mainSections = sortedSections.filter((s) => !sidebarTypes.has(s.type));
  const sidebarSections = sortedSections.filter((s) => sidebarTypes.has(s.type));

  // ── Header ───────────────────────────────────────────────────────────────
  const headerProps = { resume, tok, displaySettings, tpl };
  const headerNode =
    effectiveLayout === 'single' && tpl.headerVariant === 'banner' ? <BannerHeader {...headerProps} /> :
    effectiveLayout === 'banner' ? <BannerHeader {...headerProps} /> :
    tpl.headerVariant === 'centered' ? <CenteredHeader {...headerProps} /> :
    tpl.headerVariant === 'compact' ? <CompactHeader {...headerProps} /> :
    <LeftHeader {...headerProps} />;

  // ── Section renderer helper ──────────────────────────────────────────────
  const renderSectionList = (sections: typeof sortedSections, inSidebar: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacingGap }}>
      {sections.map((sec) => (
        <RenderSection
          key={sec.id}
          section={sec}
          tok={tok}
          tpl={tpl}
          displaySettings={displaySettings}
          inSidebar={inSidebar}
        />
      ))}
    </div>
  );

  // ── Layout ───────────────────────────────────────────────────────────────
  let bodyNode: React.ReactNode;

  if (effectiveLayout === 'sidebar-left') {
    bodyNode = (
      <div style={{ display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: '32%', minWidth: 0, background: tok.sidebarBg, padding: '20px 20px', backgroundImage: bgPattern, backgroundSize: '16px 16px' }}>
          {renderSectionList(sidebarSections, true)}
        </div>
        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, padding: '20px 28px', background: tok.bgColor }}>
          {renderSectionList(mainSections, false)}
        </div>
      </div>
    );
  } else if (effectiveLayout === 'sidebar-right') {
    bodyNode = (
      <div style={{ display: 'flex', minHeight: 0 }}>
        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, padding: '20px 28px', background: tok.bgColor }}>
          {renderSectionList(mainSections, false)}
        </div>
        {/* Sidebar */}
        <div style={{ width: '32%', minWidth: 0, background: tok.sidebarBg, padding: '20px 20px', backgroundImage: bgPattern }}>
          {renderSectionList(sidebarSections, true)}
        </div>
      </div>
    );
  } else {
    // single or banner (banner header handled above, body is single column)
    bodyNode = (
      <div style={{
        padding: '20px 40px 28px',
        background: tok.bgColor,
        backgroundImage: bgPattern,
        backgroundSize: '16px 16px',
      }}>
        {renderSectionList(sortedSections, false)}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: tok.fontFamily,
      fontSize: tok.fontSize,
      color: tok.textColor,
      background: tok.bgColor,
      minHeight: '100%',
    }}>
      {headerNode}
      {bodyNode}
    </div>
  );
}
