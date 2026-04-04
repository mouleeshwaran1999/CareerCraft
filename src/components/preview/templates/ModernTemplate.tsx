// File: src/components/preview/templates/ModernTemplate.tsx
import React from 'react';
import type { Resume } from '../../../types/resume';
import { formatDateRange } from '../templateUtils';

interface Props { resume: Resume }

export default function ModernTemplate({ resume }: Props) {
  const { header, sections, styles } = resume;
  const sorted = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const primary = styles.primaryColor;
  const accent  = styles.accentColor;
  const fs = styles.fontSize;
  const sectionGap = styles.spacing === 'compact' ? 12 : styles.spacing === 'relaxed' ? 24 : 16;

  return (
    <div style={{ fontFamily: styles.fontFamily, fontSize: fs, color: '#1a1a2e', background: '#fff' }}>
      {/* â”€â”€ Banner header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ background: primary, color: '#fff', padding: '28px 40px 20px' }}>
        <div style={{ fontSize: fs * 2.1, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {header.name || 'Your Name'}
        </div>
        {header.title && (
          <div style={{ fontSize: fs * 1.1, marginTop: 4, opacity: 0.9, fontWeight: 400 }}>{header.title}</div>
        )}
        {header.tagline && (
          <div style={{ fontSize: fs * 0.9, marginTop: 2, opacity: 0.75, fontStyle: 'italic' }}>{header.tagline}</div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 10, fontSize: fs * 0.85, opacity: 0.88 }}>
          {header.email    && <span>‰ {header.email}</span>}
          {header.phone    && <span>â˜ {header.phone}</span>}
          {header.location && <span>– {header.location}</span>}
          {header.linkedin && <span>in {header.linkedin}</span>}
          {header.github   && <span>¥ {header.github}</span>}
          {header.website  && <span>âŠ• {header.website}</span>}
        </div>
      </div>

      {/* â”€â”€ Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ padding: '20px 40px 28px' }}>
        {sorted.map((section) => {
          const c = section.content;
          return (
            <div key={section.id} style={{ marginBottom: sectionGap }}>
              {/* Section heading */}
              <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 3, marginBottom: 8, fontSize: fs * 1.0, fontWeight: 700, color: primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {section.label}
              </div>

              {c.type === 'summary' && (
                <p style={{ margin: 0, lineHeight: 1.65, color: '#374151' }}>{c.text}</p>
              )}

              {c.type === 'experience' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: fs }}>{item.role}</span>
                      {item.company && <span style={{ color: '#6b7280' }}> Â· {item.company}</span>}
                    </div>
                    <span style={{ color: '#6b7280', fontSize: fs * 0.85, whiteSpace: 'nowrap' }}>
                      {item.location && `${item.location}  `}
                      {formatDateRange(item.startDate, item.endDate, item.current)}
                    </span>
                  </div>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, listStyle: 'disc' }}>
                    {item.bullets.map((b) => (
                      <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.55, color: '#374151' }}>{b.text}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {c.type === 'education' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                      {item.institution && <span style={{ color: '#6b7280' }}> Â· {item.institution}</span>}
                    </div>
                    <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>
                      {formatDateRange(item.startDate, item.endDate, false)}
                    </span>
                  </div>
                  {(item.gpa || item.honors) && (
                    <div style={{ color: '#6b7280', fontSize: fs * 0.9 }}>
                      {item.gpa && `GPA: ${item.gpa}`}{item.honors && ` Â· ${item.honors}`}
                    </div>
                  )}
                </div>
              ))}

              {c.type === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {c.groups.map((g) => (
                    <div key={g.id} style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontWeight: 600, minWidth: 100, color: primary, flexShrink: 0 }}>{g.category}:</span>
                      <span style={{ color: '#374151' }}>{g.skills}</span>
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'projects' && c.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontWeight: 700, color: primary }}>{item.name}</span>
                    <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>
                      {formatDateRange(item.startDate, item.endDate, false)}
                    </span>
                  </div>
                  {item.techStack && <div style={{ color: accent, fontStyle: 'italic', fontSize: fs * 0.9 }}>{item.techStack}</div>}
                  {item.description && <div style={{ color: '#374151', marginTop: 2, lineHeight: 1.55 }}>{item.description}</div>}
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, listStyle: 'disc' }}>
                    {item.bullets.map((b) => (
                      <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.55, color: '#374151' }}>{b.text}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {c.type === 'certifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        {item.date && <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>{item.date}</span>}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: fs * 0.88 }}>
                        {item.issuer}{item.expiry && ` â€” Exp: ${item.expiry}`}
                      </div>
                      {item.credential && <div style={{ fontSize: fs * 0.78, fontStyle: 'italic', color: primary }}>ID: {item.credential}</div>}
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'awards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        {item.date && <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>{item.date}</span>}
                      </div>
                      {item.organization && <div style={{ color: '#6b7280', fontSize: fs * 0.88 }}>{item.organization}</div>}
                      {item.description && <div style={{ lineHeight: 1.55, color: '#374151', fontSize: fs * 0.9 }}>{item.description}</div>}
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'volunteering' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.role} Â· {item.organization}</span>
                        <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                      </div>
                      {item.description && <div style={{ lineHeight: 1.55, color: '#374151', marginTop: 2 }}>{item.description}</div>}
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'languages' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                  {c.items.map((item) => (
                    <span key={item.id}>
                      <span style={{ fontWeight: 600 }}>{item.language}</span>
                      <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}> ({item.proficiency})</span>
                    </span>
                  ))}
                </div>
              )}

              {c.type === 'courses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: '#6b7280', fontSize: fs * 0.88 }}> Â· {item.institution}{item.date && `, ${item.date}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {c.type === 'achievements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.items.map((item) => (
                    <div key={item.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        {item.date && <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}>{item.date}</span>}
                      </div>
                      {item.description && <div style={{ lineHeight: 1.55, color: '#374151', fontSize: fs * 0.9 }}>{item.description}</div>}
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
