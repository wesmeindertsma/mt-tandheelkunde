import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehandelingCard, DataService, PortfolioCase, PortfolioFotoItem, TekstenData } from '../services/data.service';

@Component({
  standalone: false,
  selector: 'app-beheer',
  templateUrl: './beheer.component.html',
  styleUrl: './beheer.component.css'
})
export class BeheerComponent implements OnInit, AfterViewInit {
  ingelogd = false;
  loginFout = '';

  actieveTab: 'portfolio' | 'behandelingen' | 'teksten' | 'instellingen' = 'portfolio';

  portfolioCases: PortfolioCase[] = [];
  behandelingen: BehandelingCard[] = [];
  teksten!: TekstenData;

  opslaanMelding = '';
  opslaanBusy = false;
  resetBevestiging = false;

  delenOpen: Record<string, boolean> = {};
  delenTekst: Record<string, string> = {};
  gekopieerd: Record<string, boolean> = {};

  private readonly SITE_URL = 'https://mttandheelkunde.nl';
  private readonly HASHTAGS: Record<string, string> = {
    'Facings':            '#facings #composiet #glimlach',
    'Gebitsslijtage':     '#gebitsslijtage #restauratief',
    'Kroon- en brugwerk': '#kroonbrugwerk #restauratief',
    'Bleken':             '#tandenbleken #whiteteeth',
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private zone: NgZone
  ) {}

  get userName(): string  { return this.authService.userName; }
  get userEmail(): string { return this.authService.userEmail; }

  ngOnInit(): void {
    this.ingelogd = this.authService.isAuthenticated;
    if (this.ingelogd) this.laadData();
  }

  ngAfterViewInit(): void {
    if (!this.ingelogd) {
      setTimeout(() => this.initGoogleButton(), 80);
    }
  }

  private initGoogleButton(): void {
    const g = (window as any)['google'];
    if (!g?.accounts?.id) {
      // Script nog niet geladen, opnieuw proberen
      setTimeout(() => this.initGoogleButton(), 400);
      return;
    }
    g.accounts.id.initialize({
      client_id: this.authService.clientId,
      callback: (response: any) => {
        this.zone.run(() => {
          const result = this.authService.handleCredentialResponse(response);
          if (result.success) {
            this.loginFout = '';
            this.ingelogd = true;
            this.laadData();
          } else {
            this.loginFout = result.message;
          }
        });
      }
    });
    const el = document.getElementById('google-signin-btn');
    if (el) {
      g.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'nl',
        width: 280
      });
    }
  }

  uitloggen(): void {
    this.authService.signOut();
    this.ingelogd = false;
    this.loginFout = '';
    setTimeout(() => this.initGoogleButton(), 80);
  }

  private laadData(): void {
    this.portfolioCases = JSON.parse(JSON.stringify(this.dataService.getPortfolio()));
    this.behandelingen  = JSON.parse(JSON.stringify(this.dataService.getBehandelingen()));
    this.teksten        = JSON.parse(JSON.stringify(this.dataService.getTeksten()));
  }

  async opslaan(): Promise<void> {
    this.opslaanBusy = true;
    try {
      await Promise.all([
        this.dataService.savePortfolio(this.portfolioCases),
        this.dataService.saveBehandelingen(this.behandelingen),
        this.dataService.saveTeksten(this.teksten),
      ]);
      this.opslaanMelding = 'Wijzigingen opgeslagen!';
    } catch {
      this.opslaanMelding = 'Fout bij opslaan, probeer opnieuw.';
    } finally {
      this.opslaanBusy = false;
      setTimeout(() => (this.opslaanMelding = ''), 3000);
    }
  }

  // ─── Portfolio: cases ──────────────────────────────────

  nieuwCase(): void {
    this.portfolioCases.unshift({ id: this.dataService.nieuwId(), behandeling: 'Nieuwe behandeling', fotos: [] });
  }

  verwijderCase(index: number): void { this.portfolioCases.splice(index, 1); }

  verplaatsCase(index: number, richting: -1 | 1): void {
    const naar = index + richting;
    if (naar < 0 || naar >= this.portfolioCases.length) return;
    [this.portfolioCases[index], this.portfolioCases[naar]] = [this.portfolioCases[naar], this.portfolioCases[index]];
  }

  // ─── Portfolio: foto's ─────────────────────────────────

  nieuweFoto(caseIndex: number): void {
    this.portfolioCases[caseIndex].fotos.push({ id: this.dataService.nieuwId(), src: '', caption: '' });
  }

  verwijderFoto(caseIndex: number, fotoIndex: number): void { this.portfolioCases[caseIndex].fotos.splice(fotoIndex, 1); }

  verplaatsFoto(caseIndex: number, fotoIndex: number, richting: -1 | 1): void {
    const fotos = this.portfolioCases[caseIndex].fotos;
    const naar = fotoIndex + richting;
    if (naar < 0 || naar >= fotos.length) return;
    [fotos[fotoIndex], fotos[naar]] = [fotos[naar], fotos[fotoIndex]];
  }

  setThumbnail(caseIndex: number, fotoId: string): void { this.portfolioCases[caseIndex].thumbnailId = fotoId; }

  isThumbnail(caseIndex: number, fotoId: string): boolean {
    const c = this.portfolioCases[caseIndex];
    return (c.thumbnailId ?? c.fotos[0]?.id) === fotoId;
  }

  async uploadPortfolioFoto(caseIndex: number, fotoIndex: number, event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const c = this.portfolioCases[caseIndex];
    const f = c.fotos[fotoIndex];
    try {
      f.src = await this.dataService.compressImage(file); // directe preview
      f.src = await this.dataService.uploadImage(file, `portfolio/${c.id}/${f.id}`);
    } catch { alert('Fout bij uploaden van afbeelding.'); }
  }

  // ─── Behandelingen ─────────────────────────────────────

  nieuweBehandeling(): void {
    this.behandelingen.unshift({ id: this.dataService.nieuwId(), titel: 'Nieuwe behandeling', foto: '', beschrijving: '' });
  }

  verwijderBehandeling(index: number): void { this.behandelingen.splice(index, 1); }

  async uploadBehandelingFoto(index: number, event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const b = this.behandelingen[index];
    try {
      b.foto = await this.dataService.compressImage(file); // directe preview
      b.foto = await this.dataService.uploadImage(file, `behandelingen/${b.id}`);
    } catch { alert('Fout bij uploaden van afbeelding.'); }
  }

  // ─── Instellingen ──────────────────────────────────────

  resetBevestigen(): void  { this.resetBevestiging = true; }

  async resetUitvoeren(): Promise<void> {
    await this.dataService.reset();
    this.laadData();
    this.resetBevestiging = false;
  }

  trackCase(_: number, c: PortfolioCase): string         { return c.id; }
  trackFoto(_: number, f: PortfolioFotoItem): string     { return f.id; }
  trackBehandeling(_: number, b: BehandelingCard): string { return b.id; }

  // ─── Delen ─────────────────────────────────────────────

  toggleDelen(c: PortfolioCase): void {
    this.delenOpen[c.id] = !this.delenOpen[c.id];
    if (this.delenOpen[c.id]) {
      this.delenTekst[c.id] = this.genereerTekst(c);
    }
  }

  private genereerTekst(c: PortfolioCase): string {
    const captions = c.fotos
      .map(f => f.caption?.trim())
      .filter(Boolean)
      .join('\n');
    const tags = this.HASHTAGS[c.behandeling] ?? '#tandheelkunde';
    return [
      `✨ ${c.behandeling}`,
      captions ? `\n${captions}` : '',
      `\n📍 PUUR Mondzorg Spoorbaan, Appingedam`,
      `🌐 ${this.SITE_URL}`,
      `\n#tandheelkunde #esthetischetandheelkunde ${tags}`,
    ].filter(Boolean).join('\n');
  }

  async delenOp(platform: 'facebook' | 'linkedin' | 'instagram', caseId: string): Promise<void> {
    const tekst = this.delenTekst[caseId] ?? '';

    // Altijd tekst naar klembord
    await navigator.clipboard.writeText(tekst);
    this.gekopieerd[caseId + platform] = true;
    setTimeout(() => delete this.gekopieerd[caseId + platform], 3000);

    const encoded = encodeURIComponent(this.SITE_URL);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}&quote=${encodeURIComponent(tekst)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank');
    }
    // Instagram: alleen kopiëren, geen web-share mogelijk
  }
}
