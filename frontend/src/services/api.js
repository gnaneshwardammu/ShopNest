// Keep API URLs consistent in development and production.  Removing a final
// slash here prevents paths such as `//api/products` when Vercel variables are
// entered with a trailing slash.
const configuredApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URL = configuredApiUrl.replace(/\/+$/, '');

export const apiFetch = (path, options) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return fetch(`${API_URL}${normalizedPath}`, options);
};
