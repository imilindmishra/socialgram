import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants/env';

export function useCloudinaryUpload(maxBytes = 5 * 1024 * 1024) {
  return async function upload(file: File): Promise<string> {
    if (!file) throw new Error('Please select an image');
    if (file.size > maxBytes) throw new Error('Image too large (max 5MB)');
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) throw new Error('Cloudinary env vars missing');

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.secure_url as string;
  };
}

