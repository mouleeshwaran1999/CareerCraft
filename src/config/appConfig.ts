// File: src/config/appConfig.ts
// Single source of truth for application branding.

export const APP_NAME = 'CareerCraft';
export const APP_TAGLINE = 'Build. Optimize. Get Hired.';
export const APP_SHORT_NAME = 'CC';
export const APP_DESCRIPTION = 'A fully client-side resume builder with ATS scoring, rich editing, and PDF export.';

// LocalStorage keys — versioned and namespaced under the product name
export const STORAGE_KEY_V1_LEGACY = 'resume_builder_v1'; // original key (pre-CareerCraft)
export const STORAGE_KEY_V2_LEGACY = 'resume_builder_v2'; // v2 key (pre-CareerCraft)
export const STORAGE_KEY = 'careercraft_v1';               // current canonical key
