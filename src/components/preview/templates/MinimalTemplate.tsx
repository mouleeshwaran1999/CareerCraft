// File: src/components/preview/templates/MinimalTemplate.tsx
import React from 'react';
import type { Resume } from '../../../types/resume';
import { formatDateRange } from '../templateUtils';

interface Props { resume: Resume }

export default function MinimalTemplate({ resume }: Props) {
  const { header, sections, styles } = resume;
  const sorted = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const fs = styles.fontSize;
  const sectionGap = styles.spacing === 'compact' ? 16 : styles.spacing === 'relaxed' ? 32 : 22;
  const muted = '#9ca3af';
  const body  = '#4b5563';

  return (
    // Full 794px page width with generous padding â€” no inner maxWidth restriction
    <div style={{ fontFamily: styles.fontFamily, fontSize: fs, color: '#111827', background: '#fff', padding: '40px 48px 36px' }}>
      {/* â”€â”€ Minimal header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: fs * 2, fontWeight: 300, letterSpacing: '-0.03em', color: '#111' }}>
          {header.name || 'Your Name'}
        </div>
        {header.title && (
          <div style={{ fontSize: fs * 1.1, color: '#6b7280', marginTop: 2 }}>{header.title}</div>
        )}
        {header.tagline && (
          <div style={{ fontSize: fs * 0.9, color: muted, marginTop: 1, fontStyle: 'italic' }}>{header.tagline}</div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: 8, fontSize: fs * 0.85, color: muted }}>
          {header.email    && <span>{header.email}</span>}
          {header.phone    && <span>{header.phone}</span>}
          {header.location && <span>{header.location}</span>}
          {header.linkedin && <span>{header.linkedin}</span>}
          {header.github   && <span>{header.github}</span>}
          {header.website  && <span>{header.website}</span>}
        </div>
      </div>

      {/* â”€â”€ Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {sorted.map((section) => {
        const c = section.content;
        return (
          <div key={section.id} style={{ marginBottom: sectionGap }}>
            {/* Minimal section label */}
            <div style={{ fontSize: fs * 0.75, fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              {section.label}
            </div>

            {c.type === 'summary' && (
              <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{c.text}</p>
            )}

            {c.type === 'experience' && c.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, lineHeight: 1.5, paddingTop: 2, textAlign: 'right', flexShrink: 0 }}>
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{item.role}</span>
                  {item.company && <span style={{ color: '#6b7280' }}> â€” {item.company}</span>}
                  {item.location && <span style={{ color: muted, fontSize: fs * 0.85 }}>, {item.location}</span>}
                  <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 16px', color: body }}>
                    {item.bullets.map((b) => (
                      <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.6 }}>{b.text}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {c.type === 'education' && c.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, textAlign: 'right', flexShrink: 0 }}>
                  {formatDateRange(item.startDate, item.endDate, false)}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>{item.degree}</span>
                  {item.field && `, ${item.field}`}
                  <div style={{ color: '#6b7280' }}>{item.institution}</div>
                  {(item.gpa || item.honors) && (
                    <div style={{ color: muted, fontSize: fs * 0.85 }}>
                      {item.gpa && `GPA ${item.gpa}`} {item.honors}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {c.type === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {c.groups.map((g) => (
                  <div key={g.id} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: '#374151', fontWeight: 500, minWidth: 90, flexShrink: 0 }}>{g.category}</span>
                    <span style={{ color: '#6b7280' }}>{g.skills}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'projects' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                {item.techStack && (
                  <span style={{ color: muted, fontSize: fs * 0.85, marginLeft: 8 }}>{item.techStack}</span>
                )}
                {item.description && <div style={{ color: body, fontSize: fs * 0.9, lineHeight: 1.55, marginTop: 1 }}>{item.description}</div>}
                <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 16px', color: body }}>
                  {item.bullets.map((b) => (
                    <li key={b.id} style={{ lineHeight: 1.6 }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}

            {c.type === 'certifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, textAlign: 'right', flexShrink: 0 }}>{item.date}</div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <div style={{ color: '#6b7280', fontSize: fs * 0.88 }}>{item.issuer}{item.expiry && ` â€“ ${item.expiry}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'awards' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, textAlign: 'right', flexShrink: 0 }}>{item.date}</div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      {item.organization && <div style={{ color: '#6b7280', fontSize: fs * 0.88 }}>{item.organization}</div>}
                      {item.description && <div style={{ color: body, lineHeight: 1.55 }}>{item.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'volunteering' && c.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, textAlign: 'right', flexShrink: 0 }}>
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>{item.role}</span>
                  {item.organization && <span style={{ color: '#6b7280' }}> â€” {item.organization}</span>}
                  {item.description && <div style={{ color: body, lineHeight: 1.55, marginTop: 2 }}>{item.description}</div>}
                </div>
              </div>
            ))}

            {c.type === 'languages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontWeight: 500, minWidth: 90, flexShrink: 0 }}>{item.language}</span>
                    <span style={{ color: '#6b7280' }}>{item.proficiency}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'courses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: '#6b7280', fontSize: fs * 0.85 }}> Â· {item.institution}{item.date && `, ${item.date}`}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {c.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 90, minWidth: 90, fontSize: fs * 0.8, color: muted, textAlign: 'right', flexShrink: 0 }}>{item.date}</div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      {item.description && <div style={{ color: body, lineHeight: 1.55 }}>{item.description}</div>}
                    </div>
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
