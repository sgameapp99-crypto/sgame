import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useSessionStore } from '../stores/session';

// 單例
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// 不注入 Bearer 的白名單端點（前綴比對）
const noAuthPrefixes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/verify-reset-token',
  '/auth/reset-password',
  '/health',
];

function shouldBypassAuth(url?: string): boolean {
  if (!url) return false;
  try {
    // url 可能已含 baseURL 或為相對路徑
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    return noAuthPrefixes.some((p) => path.startsWith(p));
  } catch {
    return false;
  }
}

api.interceptors.request.use((config: AxiosRequestConfig) => {
  try {
    const session = useSessionStore();
    if (!shouldBypassAuth(config.url) && session?.token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${session.token}` };
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401) {
        const session = useSessionStore();
        session?.setToken?.(null);
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign(`/login?redirect=${redirect}`);
        }
      }
    } catch {}
    return Promise.reject(error);
  }
);

export default api;


