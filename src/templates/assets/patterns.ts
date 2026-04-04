// File: src/templates/assets/patterns.ts
// Inline SVG patterns for subtle backgrounds — print-safe.

export type PatternName = 'dots' | 'diagonal' | 'crosshatch' | 'waves' | 'none';

/** Returns a CSS background value (e.g., `url("data:image/svg+xml,...")`) */
export function getPatternCss(name: PatternName, color = '#e5e7eb', opacity = 0.5): string {
  if (name === 'none') return 'none';

  const patterns: Record<Exclude<PatternName, 'none'>, string> = {
    dots: `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><circle cx='4' cy='4' r='1.5' fill='${encodeURIComponent(color)}' opacity='${opacity}'/></svg>`,
    diagonal: `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><path d='M0 12L12 0M-4 4L4-4M8 16L16 8' stroke='${encodeURIComponent(color)}' stroke-width='1' opacity='${opacity}'/></svg>`,
    crosshatch: `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path d='M0 8h16M8 0v16' stroke='${encodeURIComponent(color)}' stroke-width='0.5' opacity='${opacity}'/></svg>`,
    waves: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='12'><path d='M0 6 Q10 0 20 6 Q30 12 40 6' stroke='${encodeURIComponent(color)}' stroke-width='1' fill='none' opacity='${opacity}'/></svg>`,
  };

  const svg = patterns[name as keyof typeof patterns];
  return `url("data:image/svg+xml,${svg}")`;
}
