// File: src/components/editor/CertificationsEditor.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { ResumeSection, CertificationItem } from '../../types/resume';

interface Props { section: ResumeSection }

function CertRow({ item, sectionId }: { item: CertificationItem; sectionId: string }) {
  const { updateCertification, removeCertification } = useResumeStore();
  const upd = (partial: Partial<CertificationItem>) => updateCertification(sectionId, item.id, partial);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
          {item.name || 'New Certification'}
        </button>
        <button onClick={() => { if (confirm('Remove this certification?')) removeCertification(sectionId, item.id); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-xs">{open ? '▲' : '▼'}</button>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Certification Name</label>
            <input value={item.name} onChange={(e) => upd({ name: e.target.value })} placeholder="AWS Certified Solutions Architect" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Issuing Organization</label>
            <input value={item.issuer} onChange={(e) => upd({ issuer: e.target.value })} placeholder="Amazon Web Services" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Issue Date (YYYY-MM)</label>
              <input value={item.date} onChange={(e) => upd({ date: e.target.value })} placeholder="2023-04" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Expiry (YYYY-MM)</label>
              <input value={item.expiry} onChange={(e) => upd({ expiry: e.target.value })} placeholder="2026-04 or leave blank" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Credential ID</label>
            <input value={item.credential} onChange={(e) => upd({ credential: e.target.value })} placeholder="AWS-SAA-12345" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Verification URL</label>
            <input value={item.url} onChange={(e) => upd({ url: e.target.value })} type="url" placeholder="https://..." className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificationsEditor({ section }: Props) {
  const { addCertification } = useResumeStore();
  if (section.content.type !== 'certifications') return null;
  const items = section.content.items;

  return (
    <div className="space-y-3">
      {items.map((item) => <CertRow key={item.id} item={item} sectionId={section.id} />)}
      {items.length === 0 && <p className="text-xs text-gray-400 italic">No certifications yet.</p>}
      <button
        onClick={() => addCertification(section.id)}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-lg py-2 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        + Add Certification
      </button>
    </div>
  );
}
