// File: src/components/preview/ResumePreview.tsx
import React, { useRef, useState, useEffect } from 'react';
import type { Resume, DisplaySettings } from '../../types/resume';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechTemplate from './templates/TechTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import { isV2Template, TEMPLATE_MAP_V2 } from '../../templates/registry';
import TemplateRenderer from '../../templates/TemplateRenderer';
import { DEFAULT_DISPLAY_SETTINGS } from '../../utils/storage';

/**
 * A4 paper at browser 96 dpi:
 *   210 mm × (96 / 25.4) = 210 × 3.7795 ≈ 794 px
 *   297 mm × 3.7795            ≈ 1123 px
 *
 * Rendering at exactly 794 px means 1 CSS px equals 1 print px —
 * what you see on screen is precisely what gets exported to PDF.
 */
export const A4_WIDTH_PX = 794;
export const A4_MIN_HEIGHT_PX = 1123;

interface Props {
  resume: Resume;
  displaySettings?: DisplaySettings;
  /** The element at this ref is cloned by react-to-print for PDF export. */
  printRef?: React.RefObject<HTMLDivElement>;
  /**
   * Explicit zoom percentage (e.g. 75, 100, 125, 150).
   * When omitted or 0, the page auto-scales to fit the container width.
   */
  zoom?: number;
}

export default function ResumePreview({ resume, displaySettings, printRef, zoom }: Props) {
  const ds: DisplaySettings = displaySettings ?? DEFAULT_DISPLAY_SETTINGS;
  const templateId = resume.styles.templateId || 'modern';

  // ── Container-width measurement for auto-fit ─────────────────────────────
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(A4_WIDTH_PX);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setContainerW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Scale computation ─────────────────────────────────────────────────────
  // zoom=0 or omitted → fit to container (never upscale beyond 100%)
  const scale = zoom ? zoom / 100 : Math.min(1, containerW / A4_WIDTH_PX);
  const needsZoom = Math.abs(scale - 1) > 0.005;

  // ── Template selection ────────────────────────────────────────────────────
  let templateNode: React.ReactNode;
  if (isV2Template(templateId)) {
    const tpl = TEMPLATE_MAP_V2[templateId];
    templateNode = <TemplateRenderer resume={resume} tpl={tpl} displaySettings={ds} />;
  } else {
    switch (templateId) {
      case 'classic': templateNode = <ClassicTemplate  resume={resume} />; break;
      case 'minimal': templateNode = <MinimalTemplate  resume={resume} />; break;
      case 'tech':    templateNode = <TechTemplate     resume={resume} />; break;
      case 'elegant': templateNode = <ElegantTemplate  resume={resume} />; break;
      default:        templateNode = <ModernTemplate   resume={resume} />;
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  // Architecture:
  //   .resume-preview-outer   — measures available width; flex-centers content
  //     .resume-page-scaler   — CSS zoom (layout-accurate scaling, no height hackery)
  //       .resume-page-inner  — the real 794 px A4 page; this is what printRef points at
  //
  // The CSS `zoom` property is applied to .resume-page-scaler (the PARENT of printRef).
  // When react-to-print clones .resume-page-inner, the clone has no parent zoom —
  // so the PDF always prints at the unscaled 794 px × A4 dimensions.

  return (
    <div ref={outerRef} className="resume-preview-outer" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Zoom wrapper — visual only; NOT part of the printable clone */}
        <div
          className="resume-page-scaler"
          style={needsZoom ? ({ zoom: scale } as React.CSSProperties) : undefined}
        >
          {/* The A4 page — printRef lives here */}
          <div
            ref={printRef}
            className="resume-page-inner"
            data-resume-page="true"
            style={{
              width: A4_WIDTH_PX,
              minHeight: A4_MIN_HEIGHT_PX,
              background: '#ffffff',
              position: 'relative',
              boxShadow: '0 4px 24px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.08)',
            }}
          >
            {templateNode}
          </div>
        </div>
      </div>
    </div>
  );
}

