import { defineStore } from 'pinia';

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
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    loggedIn: false,
    user: null,
    userId: undefined,
    lastFetched: null,
    inFlight: null,
    ttlMs: 60_000,
  }),
  actions: {
    _set(loggedIn: boolean, user: SessionUser | null, userId?: string) {
      this.loggedIn = loggedIn;
      this.user = user;
      if (userId) this.userId = userId;
      this.lastFetched = Date.now();
    },
    async fetchSession(force = false) {
      if (!force && this.lastFetched && Date.now() - this.lastFetched < this.ttlMs) return;
      if (this.inFlight) return this.inFlight;
      this.inFlight = (async () => {
        try {
          const res = await fetch('/api/auth/session', { credentials: 'include', headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error('session failed');
          const data = await res.json().catch(() => ({}));
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
    async login(payload: { email: string; password: string; rememberme?: string }) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          rememberme: payload.rememberme,
        }),
      });
      if (!res.ok) throw new Error('login failed');
      await this.fetchSession(true);
      return res;
    },
    async logout() {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
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


