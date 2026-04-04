// File: src/components/preview/templates/TechTemplate.tsx
import React from 'react';
import type { Resume } from '../../../types/resume';
import { formatDateRange } from '../templateUtils';

interface Props { resume: Resume }

export default function TechTemplate({ resume }: Props) {
  const { header, sections, styles } = resume;
  const sorted = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const primary = styles.primaryColor;
  const accent  = styles.accentColor;
  const fs = styles.fontSize;
  const sectionGap = styles.spacing === 'compact' ? 12 : styles.spacing === 'relaxed' ? 24 : 16;
  const mono = 'JetBrains Mono, Menlo, Consolas, monospace';

  return (
    <div style={{ fontFamily: styles.fontFamily, fontSize: fs, color: '#0f172a', background: '#fff' }}>
      {/* â”€â”€ Dark terminal header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '24px 40px 20px' }}>
        <div style={{ fontFamily: mono, fontSize: fs * 1.8, fontWeight: 700, color: '#fff' }}>
          <span style={{ color: primary }}>&gt; </span>{header.name || 'Your Name'}
        </div>
        {header.title && (
          <div style={{ fontFamily: mono, color: accent, fontSize: fs, marginTop: 4 }}>
            <span style={{ opacity: 0.5 }}>// </span>{header.title}
          </div>
        )}
        {header.tagline && (
          <div style={{ fontFamily: mono, color: '#94a3b8', fontSize: fs * 0.88, marginTop: 2 }}>
            <span style={{ opacity: 0.5 }}>/* </span>{header.tagline}<span style={{ opacity: 0.5 }}> */</span>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: 12, fontSize: fs * 0.85, color: '#94a3b8', fontFamily: mono }}>
          {header.email    && <span>{header.email}</span>}
          {header.phone    && <span>{header.phone}</span>}
          {header.location && <span>{header.location}</span>}
          {header.github   && <span>gh/{header.github.replace(/.*github\.com\//,'')}</span>}
          {header.linkedin && <span>li/{header.linkedin.replace(/.*linkedin\.com\/in\//,'')}</span>}
          {header.website  && <span>{header.website}</span>}
        </div>
      </div>

      {/* â”€â”€ Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ padding: '18px 40px 28px' }}>
        {sorted.map((section) => {
          const c = section.content;
          return (
            <div key={section.id} style={{ marginBottom: sectionGap }}>
              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: mono, color: primary, fontSize: fs * 0.9 }}>##</span>
                <span style={{ fontWeight: 700, fontSize: fs * 1.0, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#0f172a' }}>{section.label}</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {c.type === 'summary' && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: `3px solid ${primary}`, padding: '8px 12px', borderRadius: 4, lineHeight: 1.6, color: '#334155' }}>
                  {c.text}
                </div>
              )}

              {c.type === 'experience' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.role}</span>
                      {item.company && <span style={{ color: primary, fontFamily: mono, fontSize: fs * 0.85 }}> @ {item.company}</span>}
                    </div>
                    <span style={{ background: '#f1f5f9', border: `1px solid ${accent}`, borderRadius: 4, padding: '1px 6px', fontSize: fs * 0.78, color: '#475569', fontFamily: mono, whiteSpace: 'nowrap' }}>
                      {item.location && `${item.location} Â· `}{formatDateRange(item.startDate, item.endDate, item.current)}
                    </span>
                  </div>
                  <ul style={{ margin: '6px 0 0 0', padding: '0 0 0 12px', borderLeft: `2px solid ${accent}` }}>
                    {item.bullets.map((b) => (
                      <li key={b.id} style={{ marginBottom: 3, lineHeight: 1.55, color: '#334155', listStyle: 'none', position: 'relative', paddingLeft: 12 }}>
                        <span style={{ position: 'absolute', left: 0, color: accent }}>â–¸</span>{b.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {c.type === 'education' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.degree}{item.field ? ` â€“ ${item.field}` : ''}</span>
                    {item.institution && <span style={{ color: '#64748b', fontFamily: mono, fontSize: fs * 0.85 }}> | {item.institution}</span>}
                    {item.gpa && <span style={{ color: primary, fontSize: fs * 0.85, marginLeft: 8 }}>GPA: {item.gpa}</span>}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                </div>
              ))}

              {c.type === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {c.groups.map((g) => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ fontFamily: mono, color: primary, fontSize: fs * 0.85, minWidth: 110, flexShrink: 0 }}>{g.category}:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {g.skills.split(',').map((sk, i) => (
                          <span key={i} style={{ background: '#f1f5f9', border: `1px solid ${accent}40`, borderRadius: 3, padding: '1px 6px', fontSize: fs * 0.82, color: '#374151' }}>{sk.trim()}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'projects' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontWeight: 700, color: primary, fontFamily: mono }}>{item.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                  </div>
                  {item.techStack && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '3px 0' }}>
                      {item.techStack.split(',').map((t, i) => (
                        <span key={i} style={{ background: `${primary}15`, border: `1px solid ${primary}40`, borderRadius: 3, padding: '1px 6px', fontSize: fs * 0.78, color: primary }}>{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  {item.description && <div style={{ color: '#334155', lineHeight: 1.55, fontSize: fs * 0.9, marginBottom: 4 }}>{item.description}</div>}
                  <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 12px', borderLeft: `2px solid ${accent}` }}>
                    {item.bullets.map((b) => (
                      <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.55, color: '#334155', listStyle: 'none', position: 'relative', paddingLeft: 12 }}>
                        <span style={{ position: 'absolute', left: 0, color: accent }}>â–¸</span>{b.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {c.type === 'certifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {c.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ fontFamily: mono, color: accent, flexShrink: 0 }}>â–¸</span>
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: '#64748b', fontFamily: mono, fontSize: fs * 0.82 }}> Â· {item.issuer}{item.date && ` (${item.date})`}</span>
                        {item.credential && <span style={{ color: primary, fontFamily: mono, fontSize: fs * 0.78 }}> ID:{item.credential}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'awards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        {item.organization && <span style={{ color: '#64748b', fontFamily: mono, fontSize: fs * 0.85 }}> Â· {item.organization}</span>}
                        {item.description && <div style={{ color: '#334155', fontSize: fs * 0.9, lineHeight: 1.5 }}>{item.description}</div>}
                      </div>
                      {item.date && <span style={{ color: '#94a3b8', fontSize: fs * 0.85, fontFamily: mono }}>{item.date}</span>}
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'volunteering' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.role} <span style={{ color: primary, fontFamily: mono }}>@</span> {item.organization}</span>
                        <span style={{ color: '#94a3b8', fontFamily: mono, fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                      </div>
                      {item.description && <div style={{ color: '#334155', lineHeight: 1.55, marginTop: 2 }}>{item.description}</div>}
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'languages' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                  {c.items.map((item) => (
                    <span key={item.id} style={{ fontFamily: mono, fontSize: fs * 0.9 }}>
                      <span style={{ color: primary }}>{item.language}</span>
                      <span style={{ color: '#94a3b8' }}>:{item.proficiency}</span>
                    </span>
                  ))}
                </div>
              )}

              {c.type === 'courses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {c.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: mono, color: accent }}>â–¸</span>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: '#64748b', fontFamily: mono, fontSize: fs * 0.82 }}>{item.institution}{item.date && ` (${item.date})`}</span>
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'achievements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {c.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        {item.description && <div style={{ color: '#334155', fontSize: fs * 0.9, lineHeight: 1.5 }}>{item.description}</div>}
                      </div>
                      {item.date && <span style={{ color: '#94a3b8', fontFamily: mono, fontSize: fs * 0.85 }}>{item.date}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
