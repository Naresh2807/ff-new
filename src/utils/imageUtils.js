// src/utils/imageUtils.js

const BASE_URL = (import.meta.env.VITE_API_URL || "https://ff-wcfj.onrender.com/api").replace("/api", "");

export const getFullImageUrl = (path) => {
  if (!path) return null;
  let cleanPath = path;
  // If it's an absolute URL (e.g., http://localhost:5000/...), extract the pathname
  if (cleanPath.startsWith('http')) {
    try {
      const url = new URL(cleanPath);
      cleanPath = url.pathname;
    } catch {
      // invalid URL – keep as is (unlikely)
    }
  }
  // Ensure it starts with '/'
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  return `${BASE_URL}${cleanPath}`;
};

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='60' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E🍽️%3C/text%3E%3C/svg%3E";