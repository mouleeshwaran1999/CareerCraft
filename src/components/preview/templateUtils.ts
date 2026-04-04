// File: src/components/preview/templateUtils.ts
import type { ResumeStyles, SpacingScale } from '../../types/resume';

export function getSpacingClass(spacing: SpacingScale): string {
  switch (spacing) {
    case 'compact': return 'space-y-1';
    case 'relaxed': return 'space-y-4';
    default: return 'space-y-2';
  }
}

export function getFontSizeStyle(fontSize: number) {
  return {
    fontSize: `${fontSize}px`,
    lineHeight: '1.5',
  };
}

export function getStyleVars(styles: ResumeStyles): React.CSSProperties {
  return {
    '--primary': styles.primaryColor,
    '--accent': styles.accentColor,
    fontFamily: `${styles.fontFamily}, sans-serif`,
    fontSize: `${styles.fontSize}px`,
  } as React.CSSProperties;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mon = month ? months[parseInt(month, 10) - 1] : '';
  return mon ? `${mon} ${year}` : year;
}

export function formatDateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}
