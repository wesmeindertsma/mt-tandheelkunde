import { Injectable } from '@angular/core';

export interface PortfolioFotoItem {
  id: string;
  src: string;      // relatief pad ('assets/...') of base64 data URL
  caption: string;
}

export interface PortfolioCase {
  id: string;
  behandeling: string;
  thumbnailId?: string;   // welke foto als grid-thumbnail; valt terug op eerste foto
  fotos: PortfolioFotoItem[];
}

export interface BehandelingCard {
  id: string;
  titel: string;
  foto: string;     // relatief pad of base64 data URL
  beschrijving: string;
}

const STANDAARD_BEHANDELINGEN: BehandelingCard[] = [
  { id: 'facings',  titel: 'Facings',           foto: 'assets/img/facings/facings1.jpeg',    beschrijving: 'Schildjes op de voorzijde van tanden voor een mooier en stralender glimlach, met minimaal verlies van tandweefsel.' },
  { id: 'slijtage', titel: 'Gebitsslijtage',     foto: 'assets/img/slijtage/slijtage1.jpeg',  beschrijving: 'Herstel van pathologische slijtage met composiet of porselein, eventueel met behulp van digital smile design.' },
  { id: 'kroon',    titel: 'Kroon- en brugwerk', foto: 'assets/img/kroonbrugwerk/brug1.jpeg', beschrijving: 'Duurzame oplossingen voor beschadigde of ontbrekende tanden en kiezen die vorm, kleur en functie herstellen.' },
  { id: 'bleken',   titel: 'Bleken',             foto: 'assets/img/bleken/bleken.jpeg',       beschrijving: 'Professioneel tandenbleken met 6% waterstofperoxide en een mal op maat voor een zichtbaar wit resultaat.' },
];

const STANDAARD_PORTFOLIO: PortfolioCase[] = [
  {
    id: 'case-facings', behandeling: 'Facings',
    fotos: [
      { id: 'f1', src: 'assets/img/facings/facings1.jpeg', caption: '' },
      { id: 'f2', src: 'assets/img/facings/facings2.jpeg', caption: '' },
      { id: 'f3', src: 'assets/img/facings/facings3.jpeg', caption: '' },
    ]
  },
  {
    id: 'case-slijtage', behandeling: 'Gebitsslijtage',
    fotos: [
      { id: 's1', src: 'assets/img/slijtage/slijtage1.jpeg', caption: '' },
      { id: 's2', src: 'assets/img/slijtage/slijtage2.jpeg', caption: '' },
      { id: 's3', src: 'assets/img/slijtage/slijtage3.jpeg', caption: '' },
    ]
  },
  {
    id: 'case-kroon', behandeling: 'Kroon- en brugwerk',
    fotos: [
      { id: 'k1', src: 'assets/img/kroonbrugwerk/brug1.jpeg', caption: '' },
      { id: 'k2', src: 'assets/img/kroonbrugwerk/brug2.jpeg', caption: '' },
      { id: 'k3', src: 'assets/img/kroonbrugwerk/brug3.jpeg', caption: '' },
      { id: 'k4', src: 'assets/img/kroonbrugwerk/brug4.jpeg', caption: '' },
      { id: 'k5', src: 'assets/img/kroonbrugwerk/brug5.jpeg', caption: '' },
      { id: 'k6', src: 'assets/img/kroonbrugwerk/brug6.jpeg', caption: '' },
    ]
  },
  {
    id: 'case-bleken', behandeling: 'Bleken',
    fotos: [
      { id: 'b1', src: 'assets/img/bleken/bleken.jpeg', caption: '' },
    ]
  },
];

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly LS_PORTFOLIO = 'mt_portfolio_v1';
  private readonly LS_BEHANDELINGEN = 'mt_behandelingen_v1';
  private readonly LS_WACHTWOORD = 'mt_beheer_pwd';

  getPortfolio(): PortfolioCase[] {
    try {
      const raw = localStorage.getItem(this.LS_PORTFOLIO);
      return raw ? JSON.parse(raw) : this.kloon(STANDAARD_PORTFOLIO);
    } catch {
      return this.kloon(STANDAARD_PORTFOLIO);
    }
  }

  savePortfolio(cases: PortfolioCase[]): void {
    localStorage.setItem(this.LS_PORTFOLIO, JSON.stringify(cases));
  }

  getBehandelingen(): BehandelingCard[] {
    try {
      const raw = localStorage.getItem(this.LS_BEHANDELINGEN);
      return raw ? JSON.parse(raw) : this.kloon(STANDAARD_BEHANDELINGEN);
    } catch {
      return this.kloon(STANDAARD_BEHANDELINGEN);
    }
  }

  saveBehandelingen(behandelingen: BehandelingCard[]): void {
    localStorage.setItem(this.LS_BEHANDELINGEN, JSON.stringify(behandelingen));
  }

  getWachtwoord(): string {
    return localStorage.getItem(this.LS_WACHTWOORD) ?? 'tandarts';
  }

  saveWachtwoord(pwd: string): void {
    if (pwd.trim()) localStorage.setItem(this.LS_WACHTWOORD, pwd.trim());
  }

  reset(): void {
    localStorage.removeItem(this.LS_PORTFOLIO);
    localStorage.removeItem(this.LS_BEHANDELINGEN);
  }

  nieuwId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  async compressImage(file: File, maxWidth = 1400): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target!.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  private kloon<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
