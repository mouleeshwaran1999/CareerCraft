// File: src/components/editor/HeaderEditor.tsx
import React, { useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { PHOTO_PLACEHOLDER_DATA_URL } from '../../templates/assets/icons';

export default function HeaderEditor() {
  const { resume, displaySettings, updateHeader } = useResumeStore();
  const h = resume.header;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const field = (label: string, key: keyof typeof h, placeholder?: string, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor={`header-${key}`}>{label}</label>
      <input
        id={`header-${key}`}
        type={type}
        value={(h[key] as string) ?? ''}
        onChange={(e) => updateHeader({ [key]: e.target.value })}
        placeholder={placeholder ?? label}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateHeader({ photo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    // Reset input so re-uploading same file fires change event
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Photo upload (only shown when showPhoto is enabled) */}
      {displaySettings.showPhoto && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <img
            src={h.photo || PHOTO_PLACEHOLDER_DATA_URL}
            alt="Profile photo preview"
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-700 mb-1">Profile Photo</p>
            <p className="text-xs text-gray-400 mb-2">Square image, under 2 MB. Stored locally.</p>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Upload Photo
              </button>
              {h.photo && (
                <button
                  onClick={() => updateHeader({ photo: '' })}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
              aria-label="Upload profile photo"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {field('Full Name', 'name', 'Jane Smith')}
        {field('Job Title', 'title', 'Software Engineer')}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="header-tagline">Tagline / Subtitle</label>
        <input
          id="header-tagline"
          type="text"
          value={h.tagline ?? ''}
          onChange={(e) => updateHeader({ tagline: e.target.value })}
          placeholder="Brief professional statement below your title"
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Email', 'email', 'jane@email.com', 'email')}
        {field('Phone', 'phone', '+1 (555) 000-0000', 'tel')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Location', 'location', 'City, State')}
        {field('Website', 'website', 'https://yoursite.com', 'url')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('LinkedIn', 'linkedin', 'linkedin.com/in/you')}
        {field('GitHub', 'github', 'github.com/you')}
      </div>
    </div>
  );
}
