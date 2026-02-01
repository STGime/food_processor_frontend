export const API_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const endpoints = {
  health: '/api/health',
  devices: {
    register: '/api/devices/register',
    me: '/api/devices/me',
  },
  extract: '/api/extract',
  status: (jobId: string) => `/api/status/${jobId}`,
  results: (jobId: string) => `/api/results/${jobId}`,
  checkout: '/api/checkout',
  gallery: {
    list: '/api/gallery',
    save: '/api/gallery',
    get: (cardId: string) => `/api/gallery/${cardId}`,
    generateImage: (cardId: string) => `/api/gallery/${cardId}/image`,
    delete: (cardId: string) => `/api/gallery/${cardId}`,
  },
} as const;
