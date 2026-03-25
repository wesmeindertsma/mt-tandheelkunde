import { Injectable } from '@angular/core';
import { BEHEER_CONFIG } from '../beheer/beheer.config';

interface AuthUser {
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user: AuthUser | null = null;
  private readonly SESSION_KEY = 'mt_google_auth';

  constructor() {
    // Herstel sessie na pagina-refresh (sessionStorage verdwijnt bij sluiten tabblad)
    const stored = sessionStorage.getItem(this.SESSION_KEY);
    if (stored) {
      const user: AuthUser = JSON.parse(stored);
      if (BEHEER_CONFIG.toegestaneEmails.includes(user.email)) {
        this._user = user;
      } else {
        sessionStorage.removeItem(this.SESSION_KEY);
      }
    }
  }

  get isAuthenticated(): boolean { return this._user !== null; }
  get userName(): string        { return this._user?.name  ?? ''; }
  get userEmail(): string       { return this._user?.email ?? ''; }
  get clientId(): string        { return BEHEER_CONFIG.googleClientId; }

  handleCredentialResponse(response: { credential: string }): { success: boolean; message: string } {
    try {
      const payload = this.decodeJwt(response.credential);
      const email = payload['email'] as string;
      const name  = payload['name']  as string;

      if (BEHEER_CONFIG.toegestaneEmails.includes(email)) {
        this._user = { email, name };
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(this._user));
        return { success: true, message: '' };
      }
      return { success: false, message: `${email} heeft geen toegang tot het beheer.` };
    } catch {
      return { success: false, message: 'Inloggen mislukt. Probeer het opnieuw.' };
    }
  }

  signOut(): void {
    this._user = null;
    sessionStorage.removeItem(this.SESSION_KEY);
    const g = (window as any)['google'];
    if (g?.accounts?.id) {
      g.accounts.id.disableAutoSelect();
    }
  }

  private decodeJwt(token: string): Record<string, unknown> {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
