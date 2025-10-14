export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
export const USE_TWEETS = String(import.meta.env.VITE_USE_TWEETS || 'false') === 'true';
