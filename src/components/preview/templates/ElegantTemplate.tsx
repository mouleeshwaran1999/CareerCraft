// File: src/components/preview/templates/ElegantTemplate.tsx
import React from 'react';
import type { Resume } from '../../../types/resume';
import { formatDateRange } from '../templateUtils';

interface Props { resume: Resume }

export default function ElegantTemplate({ resume }: Props) {
  const { header, sections, styles } = resume;
  const sorted = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const primary = styles.primaryColor;
  const accent  = styles.accentColor;
  const fs = styles.fontSize;
  const sectionGap = styles.spacing === 'compact' ? 12 : styles.spacing === 'relaxed' ? 26 : 18;
  const LEFT_MARGIN = 44;

  return (
    <div style={{ fontFamily: styles.fontFamily, fontSize: fs, color: '#1f2937', background: '#fff', padding: `36px ${LEFT_MARGIN}px 32px` }}>
      {/* â”€â”€ Elegant header with left accent bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ position: 'relative', paddingBottom: 20, marginBottom: 20 }}>
        {/* Gradient accent bar */}
        <div style={{ position: 'absolute', top: 0, left: -LEFT_MARGIN, bottom: 0, width: 6, background: `linear-gradient(to bottom, ${primary}, ${accent})` }} />
        <div style={{ fontSize: fs * 2.1, fontWeight: 600, letterSpacing: '0.06em', color: '#1f2937', lineHeight: 1.1 }}>
          {header.name || 'Your Name'}
        </div>
        {header.title && (
          <div style={{ fontSize: fs * 1.05, color: primary, marginTop: 3, fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {header.title}
          </div>
        )}
        {header.tagline && (
          <div style={{ fontSize: fs * 0.9, color: '#9ca3af', marginTop: 2, fontStyle: 'italic' }}>{header.tagline}</div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 10, fontSize: fs * 0.85, color: '#6b7280', borderTop: `1px solid ${accent}40`, paddingTop: 8 }}>
          {header.email    && <span>¦ {header.email}</span>}
          {header.phone    && <span>¦ {header.phone}</span>}
          {header.location && <span>¦ {header.location}</span>}
          {header.linkedin && <span>¦ {header.linkedin}</span>}
          {header.github   && <span>¦ {header.github}</span>}
          {header.website  && <span>¦ {header.website}</span>}
        </div>
      </div>

      {/* â”€â”€ Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {sorted.map((section) => {
        const c = section.content;
        return (
          <div key={section.id} style={{ marginBottom: sectionGap }}>
            {/* Elegant section heading */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 10 }}>
              <div style={{ width: 3, height: 16, background: primary, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, fontSize: fs * 0.95, letterSpacing: '0.1em', textTransform: 'uppercase', color: primary }}>{section.label}</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${accent}80, transparent)` }} />
            </div>

            {c.type === 'summary' && (
              <p style={{ margin: 0, lineHeight: 1.75, color: '#4b5563', fontWeight: 300, fontSize: fs }}>{c.text}</p>
            )}

            {c.type === 'experience' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 14, paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-end', gap: 4 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: fs }}>{item.role}</span>
                    {item.company && <span style={{ color: primary, fontStyle: 'italic' }}> Â· {item.company}</span>}
                  </div>
                  <span style={{ fontSize: fs * 0.82, color: '#9ca3af', fontStyle: 'italic' }}>
                    {item.location && `${item.location} Â· `}{formatDateRange(item.startDate, item.endDate, item.current)}
                  </span>
                </div>
                <ul style={{ margin: '6px 0 0 14px', padding: 0, lineHeight: 1.65 }}>
                  {item.bullets.map((b) => (
                    <li key={b.id} style={{ marginBottom: 3, color: '#4b5563' }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}

            {c.type === 'education' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontWeight: 600 }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                  <span style={{ color: '#9ca3af', fontSize: fs * 0.85, fontStyle: 'italic' }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                </div>
                <div style={{ color: primary, fontStyle: 'italic' }}>{item.institution}</div>
                {(item.gpa || item.honors) && (
                  <div style={{ color: '#9ca3af', fontSize: fs * 0.85 }}>
                    {item.gpa && `GPA: ${item.gpa}`}{item.honors && `  ${item.honors}`}
                  </div>
                )}
              </div>
            ))}

            {c.type === 'skills' && (
              <div style={{ columns: 2, columnGap: 24 }}>
                {c.groups.map((g) => (
                  <div key={g.id} style={{ breakInside: 'avoid', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: primary, fontSize: fs * 0.9 }}>{g.category} </span>
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{g.skills}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'projects' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontWeight: 600, color: primary }}>{item.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: fs * 0.85, fontStyle: 'italic' }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                </div>
                {item.techStack && <div style={{ color: accent, fontSize: fs * 0.88, fontStyle: 'italic' }}>{item.techStack}</div>}
                {item.description && <div style={{ color: '#4b5563', lineHeight: 1.6, marginTop: 1 }}>{item.description}</div>}
                <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                  {item.bullets.map((b) => (
                    <li key={b.id} style={{ color: '#4b5563', lineHeight: 1.65, marginBottom: 2 }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}

            {c.type === 'certifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      {item.date && <span style={{ color: '#9ca3af', fontSize: fs * 0.85, fontStyle: 'italic' }}>{item.date}</span>}
                    </div>
                    <div style={{ color: primary, fontStyle: 'italic', fontSize: fs * 0.9 }}>{item.issuer}{item.expiry && ` Â· Exp: ${item.expiry}`}</div>
                    {item.credential && <div style={{ color: '#9ca3af', fontSize: fs * 0.78 }}>ID: {item.credential}</div>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'awards' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      {item.date && <span style={{ color: '#9ca3af', fontSize: fs * 0.85, fontStyle: 'italic' }}>{item.date}</span>}
                    </div>
                    {item.organization && <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>{item.organization}</div>}
                    {item.description && <div style={{ color: '#4b5563', lineHeight: 1.65 }}>{item.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'volunteering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 600 }}>{item.role} Â· <span style={{ color: primary, fontStyle: 'italic' }}>{item.organization}</span></span>
                      <span style={{ color: '#9ca3af', fontSize: fs * 0.82, fontStyle: 'italic' }}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                    </div>
                    {item.description && <p style={{ margin: '3px 0 0', color: '#4b5563', lineHeight: 1.65 }}>{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'languages' && (
              <div style={{ columns: 2, columnGap: 24 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ breakInside: 'avoid', marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, color: primary }}>{item.language} </span>
                    <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: fs * 0.88 }}>{item.proficiency}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'courses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: fs * 0.88 }}> Â· {item.institution}{item.date && `, ${item.date}`}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      {item.date && <span style={{ color: '#9ca3af', fontSize: fs * 0.85, fontStyle: 'italic' }}>{item.date}</span>}
                    </div>
                    {item.description && <div style={{ color: '#4b5563', lineHeight: 1.65 }}>{item.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
