import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithPopup, signOut } from '@angular/fire/auth';
import { BEHEER_CONFIG } from '../beheer/beheer.config';

/**
 * Inloggen voor het beheer via Firebase Authentication (Google-account).
 *
 * Firebase geeft na het inloggen een ondertekend token mee aan Firestore.
 * De Firestore-regels (firestore.rules) controleren dat token en staan
 * schrijven alleen toe voor de e-mailadressen in BEHEER_CONFIG.toegestaneEmails.
 * De controle hieronder is alleen voor een nette melding in het scherm;
 * de echte beveiliging zit in de regels.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  private get user(): User | null {
    return this.auth.currentUser;
  }

  get isAuthenticated(): boolean { return this.isToegestaan(this.user); }
  get userName(): string        { return this.user?.displayName ?? ''; }
  get userEmail(): string       { return this.user?.email ?? ''; }

  /** Wacht tot Firebase een eventuele eerdere sessie heeft hersteld. */
  async gereed(): Promise<boolean> {
    await this.auth.authStateReady();
    if (this.user && !this.isToegestaan(this.user)) await signOut(this.auth);
    return this.isAuthenticated;
  }

  async login(): Promise<{ success: boolean; message: string }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const { user } = await signInWithPopup(this.auth, provider);

      if (this.isToegestaan(user)) return { success: true, message: '' };

      await signOut(this.auth);
      return { success: false, message: `${user.email} heeft geen toegang tot het beheer.` };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return { success: false, message: '' };
      }
      if (err?.code === 'auth/popup-blocked') {
        return { success: false, message: 'De inlogpop-up werd geblokkeerd. Sta pop-ups toe voor deze site.' };
      }
      return { success: false, message: 'Inloggen mislukt. Probeer het opnieuw.' };
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  private isToegestaan(user: User | null): boolean {
    return !!user?.email && user.emailVerified && BEHEER_CONFIG.toegestaneEmails.includes(user.email);
  }
}
