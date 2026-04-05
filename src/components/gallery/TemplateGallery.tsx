// File: src/components/gallery/TemplateGallery.tsx
import React, { useState } from 'react';
import { TEMPLATES } from '../../data/templates';
import { TEMPLATE_REGISTRY_V2 } from '../../templates/registry';
import { useResumeStore } from '../../store/resumeStore';
import type { TemplateDefinition, TemplateDefinitionV2 } from '../../types/resume';

type UnifiedTemplate = { kind: 'v1'; data: TemplateDefinition } | { kind: 'v2'; data: TemplateDefinitionV2 };

const CATEGORIES = ['all', 'ats', 'modern', 'classic', 'minimal', 'tech', 'elegant', 'creative', 'executive'] as const;
type Category = typeof CATEGORIES[number];

function V1Card({ template, isActive, onSelect }: { template: TemplateDefinition; isActive: boolean; onSelect: () => void }) {
  const primary = template.defaultStyles.primaryColor ?? '#2563eb';
  const accent = template.defaultStyles.accentColor ?? '#3b82f6';
  return (
    <div
      className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 overflow-hidden ${isActive ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onSelect} role="button" tabIndex={0} aria-pressed={isActive}
      aria-label={`Select ${template.name} template`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      {isActive && <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">Active</div>}
      <div className="aspect-[3/4] bg-white relative overflow-hidden" style={{ fontSize: 6 }}>
        <div style={{ background: primary, height: '22%', padding: '4px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', height: 4, width: '60%', borderRadius: 2, marginBottom: 2 }} />
          <div style={{ background: 'rgba(255,255,255,0.6)', height: 3, width: '40%', borderRadius: 2 }} />
        </div>
        <div style={{ padding: '4px 6px' }}>
          {[90, 75, 65, 55].map((w, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ background: accent, height: 2, width: `${w}%`, borderRadius: 1, marginBottom: 2 }} />
              <div style={{ background: '#e5e7eb', height: 1.5, width: `${w - 15}%`, borderRadius: 1 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-800">{template.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${primary}20`, color: primary }}>{template.category}</span>
        </div>
        <p className="text-xs text-gray-500 leading-snug">{template.description}</p>
        <div className="flex gap-1 mt-2 flex-wrap">
          {template.tags.map((tag) => <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

function V2Card({ template, isActive, onSelect }: { template: TemplateDefinitionV2; isActive: boolean; onSelect: () => void }) {
  const primary = template.tokens.primaryColor;
  const accent = template.tokens.accentColor;
  const isSidebar = template.layout !== 'single' && template.layout !== 'banner';

  return (
    <div
      className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 overflow-hidden ${isActive ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onSelect} role="button" tabIndex={0} aria-pressed={isActive}
      aria-label={`Select ${template.name} template`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      {isActive && <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">Active</div>}
      {template.isAtsFriendly && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">ATS</div>
      )}

      {/* Mini thumbnail */}
      <div className="aspect-[3/4] relative overflow-hidden" style={{ background: template.tokens.bgColor }}>
        {template.layout === 'banner' && (
          <div style={{ background: primary, height: '25%', width: '100%' }} />
        )}
        {isSidebar && (
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ background: template.tokens.sidebarBg, width: '35%' }} />
            <div style={{ flex: 1, padding: '4px 4px' }}>
              {[85, 70, 60, 50].map((w, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div style={{ background: accent + '60', height: 1.5, width: `${w}%`, borderRadius: 1, marginBottom: 1.5 }} />
                  <div style={{ background: '#e5e7eb', height: 1, width: `${w - 12}%`, borderRadius: 1 }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {!isSidebar && template.layout !== 'banner' && (
          <>
            <div style={{ background: primary, height: '20%', padding: '3px 5px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.85)', height: 4, width: '55%', borderRadius: 2, marginBottom: 2 }} />
              <div style={{ background: 'rgba(255,255,255,0.55)', height: 2.5, width: '40%', borderRadius: 1 }} />
            </div>
            <div style={{ padding: '4px 5px' }}>
              {[85, 70, 60, 50].map((w, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div style={{ background: accent + '70', height: 2, width: `${w}%`, borderRadius: 1, marginBottom: 1.5 }} />
                  <div style={{ background: '#e5e7eb', height: 1.5, width: `${w - 12}%`, borderRadius: 1 }} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-800">{template.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${primary}20`, color: primary }}>{template.category}</span>
        </div>
        <p className="text-xs text-gray-500 leading-snug">{template.description}</p>
        <div className="flex gap-1 mt-2 flex-wrap">
          {template.tags.map((tag) => <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
          {template.flags.supportsPhoto && <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Photo</span>}
        </div>
      </div>
    </div>
  );
}

export default function TemplateGallery({ compact = false }: { compact?: boolean }) {
  const { resume, applyTemplate, setPage } = useResumeStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [atsOnly, setAtsOnly] = useState(false);

  const activeTemplateId = resume.styles.templateId;

  // Unify V1 + V2 into a single list
  const all: UnifiedTemplate[] = [
    ...TEMPLATES.map((t): UnifiedTemplate => ({ kind: 'v1', data: t })),
    ...TEMPLATE_REGISTRY_V2.map((t): UnifiedTemplate => ({ kind: 'v2', data: t })),
  ];

  const filtered = all.filter((t) => {
    const name = t.data.name.toLowerCase();
    const tags = t.data.tags.map((g) => g.toLowerCase());
    const cat = t.data.category.toLowerCase();
    const isAts = t.kind === 'v2' ? t.data.isAtsFriendly : false;
    const matchSearch = search === '' || name.includes(search.toLowerCase()) || tags.some((tag) => tag.includes(search.toLowerCase()));
    const matchCat = category === 'all' || cat === category || (category === 'ats' && isAts);
    const matchAts = !atsOnly || isAts;
    return matchSearch && matchCat && matchAts;
  });

  const handleSelectV1 = (tpl: TemplateDefinition) => applyTemplate(tpl.id, tpl.defaultStyles);
  const handleSelectV2 = (tpl: TemplateDefinitionV2) => applyTemplate(tpl.id, tpl.defaultStyles);

  const allTemplates = [...TEMPLATES, ...TEMPLATE_REGISTRY_V2];
  const activeTemplate = allTemplates.find((t) => t.id === activeTemplateId);

  return (
    <div className={compact ? 'p-3' : 'p-6 max-w-7xl mx-auto'}>
      {!compact && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Template Gallery</h1>
          <p className="text-sm text-gray-500">{TEMPLATES.length} classic + {TEMPLATE_REGISTRY_V2.length} V2 templates — {TEMPLATE_REGISTRY_V2.filter((t) => t.isAtsFriendly).length} ATS-certified.</p>
        </div>
      )}

      {/* Search + Filter */}
      <div className={`flex gap-2 mb-3 ${compact ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search templates"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={atsOnly}
            onChange={(e) => setAtsOnly(e.target.checked)}
            className="w-4 h-4 accent-green-500"
          />
          <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md font-medium text-xs">ATS-Friendly only</span>
        </label>
      </div>
      <div className={`flex gap-1.5 mb-4 ${compact ? 'overflow-x-auto pb-1 flex-nowrap scrollbar-none' : 'flex-wrap'}`} role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${category === cat ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
            aria-pressed={category === cat}
          >
            {cat === 'ats' ? 'ATS-Friendly' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid gap-4 ${
        compact
          ? 'grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      }`}>
        {filtered.map((t) =>
          t.kind === 'v1'
            ? <V1Card key={t.data.id} template={t.data} isActive={activeTemplateId === t.data.id} onSelect={() => handleSelectV1(t.data)} />
            : <V2Card key={t.data.id} template={t.data} isActive={activeTemplateId === t.data.id} onSelect={() => handleSelectV2(t.data)} />
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm">No templates match your search.</p>
        </div>
      )}

      {!compact && activeTemplateId && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="font-semibold text-blue-800">Selected: </span>
            <span className="text-blue-700">{activeTemplate?.name ?? activeTemplateId}</span>
          </div>
          <button
            onClick={() => setPage('editor')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Edit Resume →
          </button>
        </div>
      )}
    </div>
  );
}


