const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url) return 'http://localhost:5000/api/v1';
  // Strip trailing slash if user added it accidentally
  if (url.endsWith('/')) url = url.slice(0, -1);
  // Auto-append /api/v1 if the user only provided the base domain
  if (!url.endsWith('/api/v1')) url += '/api/v1';
  return url;
};

export const CONSTANTS = {
  API_URL: getApiUrl(),
  TOKEN_KEY: 'complaint_system_token',
  USER_TYPE_KEY: 'complaint_system_user_type'
};
