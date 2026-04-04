// File: src/data/templates.ts
import type { TemplateDefinition } from '../types/resume';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern',
    category: 'modern',
    description: 'Clean sidebar layout with bold section headers and accent line.',
    supportsColumns: true,
    tags: ['popular', 'professional', 'colorful'],
    defaultStyles: {
      fontFamily: 'Inter',
      fontSize: 14,
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      spacing: 'normal',
      columns: 1,
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'classic',
    description: 'Traditional serif-based layout, perfect for academic and formal applications.',
    supportsColumns: false,
    tags: ['traditional', 'formal', 'academic'],
    defaultStyles: {
      fontFamily: 'Georgia',
      fontSize: 13,
      primaryColor: '#1e3a5f',
      accentColor: '#4a7ab5',
      spacing: 'normal',
      columns: 1,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'minimal',
    description: 'Ultra-clean single-column layout with generous whitespace.',
    supportsColumns: false,
    tags: ['clean', 'simple', 'whitespace'],
    defaultStyles: {
      fontFamily: 'Inter',
      fontSize: 13,
      primaryColor: '#111827',
      accentColor: '#6b7280',
      spacing: 'relaxed',
      columns: 1,
    },
  },
  {
    id: 'tech',
    name: 'Tech',
    category: 'tech',
    description: 'Developer-focused layout with monospace accents and a dark header strip.',
    supportsColumns: true,
    tags: ['developer', 'engineering', 'tech'],
    defaultStyles: {
      fontFamily: 'Roboto',
      fontSize: 13,
      primaryColor: '#059669',
      accentColor: '#10b981',
      spacing: 'compact',
      columns: 2,
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    category: 'elegant',
    description: 'Sophisticated two-tone design with italic accents, ideal for creative fields.',
    supportsColumns: true,
    tags: ['creative', 'design', 'stylish'],
    defaultStyles: {
      fontFamily: 'Raleway',
      fontSize: 14,
      primaryColor: '#7c3aed',
      accentColor: '#a78bfa',
      spacing: 'normal',
      columns: 1,
    },
  },
];

export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));
