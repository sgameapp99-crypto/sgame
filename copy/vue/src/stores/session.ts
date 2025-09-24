import { defineStore } from 'pinia';
import api from '../api/client';

interface SessionUser {
  id?: string | number;
  name?: string;
  email?: string;
}

interface SessionState {
  loggedIn: boolean;
  user: SessionUser | null;
  userId?: string;
  lastFetched: number | null;
  inFlight: Promise<void> | null;
  ttlMs: number;
  emailVerified?: boolean;
  verificationCheckedAt?: number | null;
  token?: string | null;
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    loggedIn: false,
    user: null,
    userId: undefined,
    lastFetched: null,
    inFlight: null,
    ttlMs: 60_000,
    emailVerified: undefined,
    verificationCheckedAt: null,
    token: null,
  }),
  actions: {
    _set(loggedIn: boolean, user: SessionUser | null, userId?: string) {
      this.loggedIn = loggedIn;
      this.user = user;
      if (userId) this.userId = userId;
      this.lastFetched = Date.now();
    },
    setToken(t?: string | null) {
      this.token = t || null;
      try {
        if (this.token) localStorage.setItem('sg_token', this.token);
        else localStorage.removeItem('sg_token');
      } catch {}
    },
    loadTokenFromStorage() {
      try {
        const t = localStorage.getItem('sg_token');
        if (t) this.token = t;
      } catch {}
    },
    async fetchSession(force = false) {
      if (!force && this.lastFetched && Date.now() - this.lastFetched < this.ttlMs) return;
      if (this.inFlight) return this.inFlight;
      this.inFlight = (async () => {
        try {
          const res = await api.get('/auth/session');
          const data = res.data || {};
          const uid: string | undefined = data?.userId || data?.user?.id;
          this._set(!!data?.loggedIn, data?.user || null, uid);
        } catch {
          this._set(false, null, undefined);
        } finally {
          this.inFlight = null;
        }
      })();
      await this.inFlight;
    },
    async checkVerificationStatus(force = false): Promise<boolean | undefined> {
      if (!this.loggedIn) return undefined;
      const now = Date.now();
      const ttl = 30_000; // 30s TTL，避免過度打後端
      if (!force && this.verificationCheckedAt && now - this.verificationCheckedAt < ttl && typeof this.emailVerified !== 'undefined') {
        return this.emailVerified;
      }
      try {
        const res = await api.get('/auth/verification-status');
        const data = (res.data || {}) as any;
        if (data && typeof data.isVerified === 'boolean') {
          this.emailVerified = !!data.isVerified;
          this.verificationCheckedAt = now;
          return this.emailVerified;
        }
      } catch {
        // ignore errors, leave as undefined
      }
      this.verificationCheckedAt = now;
      return this.emailVerified;
    },
    async login(payload: { email: string; password: string; rememberme?: string }) {
      const res = await api.post('/auth/login', {
        email: payload.email,
        password: payload.password,
        rememberme: payload.rememberme,
      });
      if (res.status !== 200 && res.status !== 204) throw new Error('login failed');
      if (res.status === 200) {
        const data = (res.data || {}) as any;
        if (data?.token) this.setToken(String(data.token));
      }
      await this.fetchSession(true);
      return res;
    },
    async logout() {
      await api.post('/auth/logout');
      this.setToken(null);
      await this.fetchSession(true);
    },
    async ensureProfile() {
      if (!this.loggedIn) return;
      if (!this.userId) return;
      if (this.user && this.user.name) return;
      try {
        const res = await fetch(`/api/members/${encodeURIComponent(this.userId)}/profile`, { credentials: 'include', headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const profile = await res.json().catch(() => null);
        if (profile) {
          this.user = {
            id: profile.id ?? this.userId,
            name: profile.name,
            email: this.user?.email,
          };
        }
      } catch {
        // ignore
      }
    },
    refresh() {
      this.lastFetched = null;
      return this.fetchSession(true);
    },
  },
});


