import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useSessionStore } from '../stores/session';

// 單例
// 使用代理方式訪問後端 API (瀏覽器無法直接訪問自簽名證書的 HTTPS)
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
  '/auth/session',  // session 查詢允許返回 401，不應觸發導向
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
      const requestUrl = error?.config?.url || '';
      
      if (status === 401) {
        const session = useSessionStore();
        session?.setToken?.(null);
        
        // 不在以下情況觸發自動導向：
        // 1. 已經在登入或註冊頁面
        // 2. 請求的是白名單 API（如 /auth/session 查詢本來就可能返回 401）
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/register');
        const isWhitelistAPI = shouldBypassAuth(requestUrl);
        
        if (!isAuthPage && !isWhitelistAPI) {
          const redirect = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.assign(`/login?redirect=${redirect}`);
        }
      }
    } catch {}
    return Promise.reject(error);
  }
);

export default api;


