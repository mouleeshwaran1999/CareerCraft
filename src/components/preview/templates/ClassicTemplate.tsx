// File: src/components/preview/templates/ClassicTemplate.tsx
import React from 'react';
import type { Resume } from '../../../types/resume';
import { formatDateRange } from '../templateUtils';

interface Props { resume: Resume }

export default function ClassicTemplate({ resume }: Props) {
  const { header, sections, styles } = resume;
  const sorted = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const primary = styles.primaryColor;
  const fs = styles.fontSize;
  const sectionGap = styles.spacing === 'compact' ? 10 : styles.spacing === 'relaxed' ? 22 : 14;

  return (
    <div style={{ fontFamily: `Georgia, ${styles.fontFamily}, serif`, fontSize: fs, color: '#1a1a2e', background: '#fff', padding: '36px 48px 32px' }}>
      {/* â”€â”€ Centered header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${primary}`, paddingBottom: 16, marginBottom: 18 }}>
        <div style={{ fontSize: fs * 2.1, fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'Georgia, serif' }}>
          {header.name || 'Your Name'}
        </div>
        {header.title && (
          <div style={{ fontSize: fs * 1.1, color: primary, margin: '4px 0', fontStyle: 'italic' }}>{header.title}</div>
        )}
        {header.tagline && (
          <div style={{ fontSize: fs * 0.9, color: '#6b7280', marginTop: 2, fontStyle: 'italic' }}>{header.tagline}</div>
        )}
        <div style={{ fontSize: fs * 0.85, color: '#555', marginTop: 6, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3px 16px' }}>
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
            <div style={{ fontSize: fs * 1.05, fontWeight: 700, color: primary, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${primary}`, paddingBottom: 2, marginBottom: 8 }}>
              {section.label}
            </div>

            {c.type === 'summary' && (
              <p style={{ margin: 0, lineHeight: 1.7, color: '#374151', fontStyle: 'italic' }}>{c.text}</p>
            )}

            {c.type === 'experience' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontWeight: 700 }}>{item.role}{item.company ? `, ${item.company}` : ''}</span>
                  <span style={{ color: '#555', fontSize: fs * 0.85 }}>
                    {item.location && `${item.location}  `}{formatDateRange(item.startDate, item.endDate, item.current)}
                  </span>
                </div>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {item.bullets.map((b) => (
                    <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.65 }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}

            {c.type === 'education' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontWeight: 700 }}>
                    {item.degree}{item.field ? ` in ${item.field}` : ''}, <em>{item.institution}</em>
                  </span>
                  <span style={{ color: '#555', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                </div>
                {(item.gpa || item.honors) && (
                  <div style={{ color: '#555', fontSize: fs * 0.9 }}>
                    {item.gpa && `GPA: ${item.gpa}`}{item.honors && `  ${item.honors}`}
                  </div>
                )}
              </div>
            ))}

            {c.type === 'skills' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {c.groups.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 600, paddingRight: 12, verticalAlign: 'top', whiteSpace: 'nowrap', color: primary, width: '20%', fontSize: fs }}>{g.category}:</td>
                      <td style={{ lineHeight: 1.65 }}>{g.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {c.type === 'projects' && c.items.map((item) => (
              <div key={item.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{item.name}</span>
                  <span style={{ color: '#555', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, false)}</span>
                </div>
                {item.techStack && <div style={{ color: '#555', fontSize: fs * 0.9 }}>Technologies: {item.techStack}</div>}
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {item.bullets.map((b) => (
                    <li key={b.id} style={{ marginBottom: 2, lineHeight: 1.65 }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}

            {c.type === 'certifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{item.name}</span>
                      {item.date && <span style={{ color: '#555', fontSize: fs * 0.85 }}>{item.date}</span>}
                    </div>
                    <div style={{ color: '#555', fontSize: fs * 0.9 }}>
                      {item.issuer}{item.expiry && ` â€” Exp: ${item.expiry}`}
                    </div>
                    {item.credential && <div style={{ fontSize: fs * 0.78, color: primary, fontStyle: 'italic' }}>ID: {item.credential}</div>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'awards' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      {item.date && <span style={{ color: '#555', fontSize: fs * 0.85 }}>{item.date}</span>}
                    </div>
                    {item.organization && <div style={{ color: '#555', fontSize: fs * 0.9 }}>{item.organization}</div>}
                    {item.description && <div style={{ lineHeight: 1.65, color: '#374151' }}>{item.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'volunteering' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 700 }}>{item.role}, <em>{item.organization}</em></span>
                      <span style={{ color: '#555', fontSize: fs * 0.85 }}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                    </div>
                    {item.description && <div style={{ lineHeight: 1.65, color: '#374151' }}>{item.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {c.type === 'languages' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 20px' }}>
                {c.items.map((item) => (
                  <span key={item.id}>
                    <span style={{ fontWeight: 700 }}>{item.language}</span>
                    <span style={{ color: '#555', fontSize: fs * 0.85 }}> ({item.proficiency})</span>
                  </span>
                ))}
              </div>
            )}

            {c.type === 'courses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{item.name}</span>
                    <span style={{ color: '#555', fontSize: fs * 0.88 }}> Â· {item.institution}{item.date && `, ${item.date}`}</span>
                  </div>
                ))}
              </div>
            )}

            {c.type === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div key={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      {item.date && <span style={{ color: '#555', fontSize: fs * 0.85 }}>{item.date}</span>}
                    </div>
                    {item.description && <div style={{ lineHeight: 1.65, color: '#374151' }}>{item.description}</div>}
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
