// File: src/components/editor/StylePanel.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { SpacingScale, LayoutColumns } from '../../types/resume';
import { TEMPLATES } from '../../data/templates';
import { TEMPLATE_REGISTRY_V2 } from '../../templates/registry';

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Sans)' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Lato', label: 'Lato' },
];

export default function StylePanel() {
  const { resume, displaySettings, updateStyles, updateDisplaySettings } = useResumeStore();
  const { styles } = resume;
  const currentV1Template = TEMPLATES.find((t) => t.id === styles.templateId);
  const currentV2Template = TEMPLATE_REGISTRY_V2.find((t) => t.id === styles.templateId);
  const supportsColumns = currentV1Template?.supportsColumns ?? false;
  const v2SupportsPhoto = currentV2Template?.flags.supportsPhoto ?? false;

  return (
    <div className="space-y-5 text-sm">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Font Family</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => updateStyles({ fontFamily: e.target.value })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Font family"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Font Size: <span className="font-bold">{styles.fontSize}px</span>
        </label>
        <input
          type="range"
          min={11}
          max={16}
          step={0.5}
          value={styles.fontSize}
          onChange={(e) => updateStyles({ fontSize: parseFloat(e.target.value) })}
          className="w-full accent-blue-500"
          aria-label="Font size"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>11px</span><span>16px</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Primary Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={styles.primaryColor}
            onChange={(e) => updateStyles({ primaryColor: e.target.value })}
            className="w-8 h-8 border-0 rounded cursor-pointer"
            aria-label="Primary color"
          />
          <input
            type="text"
            value={styles.primaryColor}
            onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) updateStyles({ primaryColor: e.target.value }); }}
            className="flex-1 border border-gray-300 rounded px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Primary color hex"
          />
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {['#2563eb','#dc2626','#059669','#7c3aed','#ea580c','#0e7490','#1e3a5f','#111827'].map((c) => (
            <button
              key={c}
              onClick={() => updateStyles({ primaryColor: c })}
              style={{ background: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${styles.primaryColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
              aria-label={`Set primary color to ${c}`}
              title={c}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Accent Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={styles.accentColor}
            onChange={(e) => updateStyles({ accentColor: e.target.value })}
            className="w-8 h-8 border-0 rounded cursor-pointer"
            aria-label="Accent color"
          />
          <input
            type="text"
            value={styles.accentColor}
            onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) updateStyles({ accentColor: e.target.value }); }}
            className="flex-1 border border-gray-300 rounded px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Accent color hex"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Spacing</label>
        <div className="flex gap-2">
          {(['compact', 'normal', 'relaxed'] as SpacingScale[]).map((s) => (
            <button
              key={s}
              onClick={() => updateStyles({ spacing: s })}
              className={`flex-1 py-1.5 text-xs rounded border transition-colors ${styles.spacing === s ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}
              aria-pressed={styles.spacing === s}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {supportsColumns && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Layout</label>
          <div className="flex gap-2">
            {([1, 2] as LayoutColumns[]).map((cols) => (
              <button
                key={cols}
                onClick={() => updateStyles({ columns: cols })}
                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${styles.columns === cols ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}
                aria-pressed={styles.columns === cols}
              >
                {cols === 1 ? '1 Column' : '2 Columns'}
              </button>
            ))}
          </div>
          {styles.columns === 2 && (
            <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              ⚠ 2-column layouts may not parse correctly in all ATS systems.
            </p>
          )}
        </div>
      )}

      {/* Display Settings */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Display Options</label>
        <div className="space-y-2">
          {([
            { key: 'atsFriendlyMode', label: 'ATS-Friendly Mode', desc: 'Forces single column, hides decorations' },
            { key: 'showIcons', label: 'Show Section Icons', desc: 'Icons before each section heading' },
            { key: 'showBackground', label: 'Show Background Pattern', desc: 'Decorative background (V2 templates)' },
            { key: 'showPhoto', label: 'Show Profile Photo', desc: v2SupportsPhoto ? 'Upload photo in Contact tab' : 'Not supported by current template', disabled: !v2SupportsPhoto },
          ] as { key: keyof typeof displaySettings; label: string; desc: string; disabled?: boolean }[]).map(({ key, label, desc, disabled }) => (
            <label key={key} className={`flex items-start gap-2 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="checkbox"
                checked={displaySettings[key]}
                onChange={(e) => !disabled && updateDisplaySettings({ [key]: e.target.checked })}
                disabled={disabled}
                className="mt-0.5 w-3.5 h-3.5 accent-blue-500"
                aria-label={label}
              />
              <div>
                <span className="text-sm text-gray-700 font-medium block">{label}</span>
                <span className="text-xs text-gray-400">{desc}</span>
              </div>
            </label>
          ))}
        </div>
        {displaySettings.atsFriendlyMode && (
          <p className="text-xs text-green-700 mt-2 bg-green-50 border border-green-200 rounded px-2 py-1">
            ✓ ATS mode active — template will render in a clean, parser-friendly layout.
          </p>
        )}
      </div>
    </div>
  );
}
