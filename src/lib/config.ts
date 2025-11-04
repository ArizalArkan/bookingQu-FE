const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_BASE_URL) {
    return import.meta.env.PUBLIC_API_BASE_URL;
  }
  return 'http://localhost:3000';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
};
