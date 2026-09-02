// Configure these two values with your Supabase project.
export const SUPABASE_URL = window.UB_CONFIG?.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = window.UB_CONFIG?.SUPABASE_ANON_KEY || '';
export const STORAGE_BUCKET = 'project-art';
export const DEMO_MODE = !(SUPABASE_URL && SUPABASE_ANON_KEY);
