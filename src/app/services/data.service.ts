import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

export interface PortfolioFotoItem {
  id: string;
  src: string;      // Firebase Storage URL of relatief pad voor standaardfotos
  caption: string;
}

export interface PortfolioCase {
  id: string;
  behandeling: string;
  thumbnailId?: string;
  fotos: PortfolioFotoItem[];
}

export interface BehandelingCard {
  id: string;
  titel: string;
  foto: string;
  beschrijving: string;
  detailTekst?: string;
}

export interface TekstenData {
  heroTagline: string;
  wieIkBenPar1: string;
  wieIkBenPar2: string;
  openingstijdMa: string;
  openingstijdDiVr: string;
}

const STANDAARD_BEHANDELINGEN: BehandelingCard[] = [
  {
    id: 'facings',
    titel: 'Facings',
    foto: 'assets/img/facings/facings1.jpeg',
    beschrijving: 'Schildjes op de voorzijde van tanden voor een mooier en stralender glimlach, met minimaal verlies van tandweefsel.',
    detailTekst: `Een facing is een schildje op de voorzijde van een tand of kies voor een mooier en stralender glimlach, met minimaal verlies van tandweefsel.

Verschil tussen facing en kroon
Een facing is niet hetzelfde als een kroon. Bij een kroon wordt er een kapje over de gehele tand of kies geplaatst; bij een facing een schildje ertegen. Voor een kroon moet er veel tandweefsel worden opgeofferd, voor een facing veel minder of soms helemaal niets.

Werkwijze
Allereerst wordt tijdens een intake naar het gehele gebit gekeken en een behandelplan met begroting opgesteld. Er kan gekozen worden voor facings die met een mal of uit de hand worden vervaardigd. De maltechniek wordt met behulp van 'digital smile design' gemaakt, waardoor u van tevoren een idee krijgt hoe de tanden eruit komen te zien. Facings uit de hand zijn in één sessie klaar. Voor porseleinen facings wordt altijd een smile design gemaakt.

Kosten indicatie
Smile design: €400
Composieten facings: €150–200 per tand
Porseleinen facings: €500 per tand`,
  },
  {
    id: 'slijtage',
    titel: 'Gebitsslijtage',
    foto: 'assets/img/slijtage/slijtage1.jpeg',
    beschrijving: 'Herstel van pathologische slijtage met composiet of porselein, eventueel met behulp van digital smile design.',
    detailTekst: `Gebitsslijtage ontstaat door verlies van tandweefsel door andere oorzaken dan cariës. Het komt bij iedereen voor (fysiologische slijtage), maar soms verloopt het sneller dan normaal (pathologische slijtage). De tanden worden dan steeds korter; het glazuur slijt in, waarna het tandbeen bloot kan komen te liggen.

Werkwijze
Tijdens een intake wordt de mate van slijtage in kaart gebracht en een passend behandelplan opgesteld. De slijtage wordt doorgaans hersteld met een laagje composiet. Indien het composiet na verloop van jaren snel slijt, kan dit worden omgezet in porselein. Bij een omvangrijk slijtage-plan wordt eerst een digital smile design gemaakt, waarna de slijtage met mallen wordt opgebouwd.`,
  },
  {
    id: 'kroon',
    titel: 'Kroon- en brugwerk',
    foto: 'assets/img/kroonbrugwerk/brug1.jpeg',
    beschrijving: 'Duurzame oplossingen voor beschadigde of ontbrekende tanden en kiezen die vorm, kleur en functie herstellen.',
    detailTekst: `Een kroon is een overkappend dopje over een beschadigde tand of kies dat stevigheid geeft. Een brug is de oplossing indien er één of meer tanden of kiezen ontbreken. Zowel kronen als bruggen benaderen de oorspronkelijke vorm, kleur en functie zoveel mogelijk en beschermen de resterende tandstructuur.

Werkwijze
Tijdens een intake wordt beoordeeld welke behandeling het meest passend is. Kronen en bruggen worden vervaardigd van porselein of keramiek en zijn ontworpen voor langdurig gebruik. Na een digitale scan of afdruk maakt het lab de restauratie op maat.`,
  },
  {
    id: 'bleken',
    titel: 'Bleken',
    foto: 'assets/img/bleken/bleken.jpeg',
    beschrijving: 'Professioneel tandenbleken met 6% waterstofperoxide en een mal op maat voor een zichtbaar wit resultaat.',
    detailTekst: `Tanden laten bleken bij de tandarts is de meest effectieve methode om de tanden witter te maken. Alleen tandartsen mogen werken met 6% waterstofperoxide — de enige stof die tanden echt witter maakt. Er wordt gewerkt met een mal op maat, welke 's nachts met de bleekgel wordt gedragen.

ICON – behandeling van witte vlekken
ICON is een pijnloze, snelle en esthetische behandeling voor 'white spots': kalkvlekjes, fluorose en witte vlekjes na verwijdering van een beugel. De behandeling werkt via infiltratie in de witte vlek en is niet invasief — er wordt niet aan de tand geslepen.`,
  },
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

const STANDAARD_TEKSTEN: TekstenData = {
  heroTagline: 'Restauratief en esthetisch gespecialiseerd tandheelkundige in Appingedam',
  wieIkBenPar1: 'In juli 2016 ben ik afgestudeerd als tandarts aan de Rijksuniversiteit te Groningen. Inmiddels werk ik in verschillende praktijken met als \'hoofd praktijk\' PUUR mondzorg Spoorbaan te Appingedam. De afgelopen jaren heb ik bij- en nascholing gevolgd in verschillende vakgebieden.',
  wieIkBenPar2: 'Mijn passie ligt bij de restauratieve en esthetische tandheelkunde, waarvan u op deze website verschillende voorbeelden zult vinden. Ik vind het belangrijk om kwaliteit te leveren, een passend behandelplan te maken en stel daarbij de patiënt centraal — want iedereen is uniek!',
  openingstijdMa: 'Maandag: 08:00 – 21:00 uur',
  openingstijdDiVr: 'Di t/m vrijdag: 08:00 – 17:00 uur',
};

// localStorage-sleutels als snelle cache voor eerste render
const LS_PORTFOLIO    = 'mt_portfolio_v1';
const LS_BEHANDELINGEN = 'mt_behandelingen_v1';
const LS_TEKSTEN      = 'mt_teksten_v1';
const LS_WACHTWOORD   = 'mt_beheer_pwd';

function getCached<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
  } catch {
    return JSON.parse(JSON.stringify(fallback));
  }
}

@Injectable({ providedIn: 'root' })
export class DataService implements OnDestroy {

  private _portfolio$     = new BehaviorSubject<PortfolioCase[]>(getCached(LS_PORTFOLIO, STANDAARD_PORTFOLIO));
  portfolio$: Observable<PortfolioCase[]> = this._portfolio$.asObservable();

  private _behandelingen$ = new BehaviorSubject<BehandelingCard[]>(getCached(LS_BEHANDELINGEN, STANDAARD_BEHANDELINGEN));
  behandelingen$: Observable<BehandelingCard[]> = this._behandelingen$.asObservable();

  private _teksten$       = new BehaviorSubject<TekstenData>(getCached(LS_TEKSTEN, STANDAARD_TEKSTEN));
  teksten$: Observable<TekstenData> = this._teksten$.asObservable();

  private unsubFirestore: (() => void) | undefined;

  constructor(private firestore: Firestore, private storage: Storage) {
    // Real-time listener: zodra Firestore data binnenkomt, update alles
    this.unsubFirestore = onSnapshot(doc(this.firestore, 'site/data'), snap => {
      const d = snap.data();
      if (!d) return;
      if (Array.isArray(d['portfolio'])) {
        localStorage.setItem(LS_PORTFOLIO, JSON.stringify(d['portfolio']));
        this._portfolio$.next(d['portfolio']);
      }
      if (Array.isArray(d['behandelingen'])) {
        localStorage.setItem(LS_BEHANDELINGEN, JSON.stringify(d['behandelingen']));
        this._behandelingen$.next(d['behandelingen']);
      }
      if (d['teksten']) {
        localStorage.setItem(LS_TEKSTEN, JSON.stringify(d['teksten']));
        this._teksten$.next(d['teksten']);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubFirestore?.();
  }

  // ─── Synchrone snapshots (voor beheer-initialisatie) ───

  getPortfolio(): PortfolioCase[]     { return this._portfolio$.value; }
  getBehandelingen(): BehandelingCard[] { return this._behandelingen$.value; }
  getTeksten(): TekstenData           { return this._teksten$.value; }

  // ─── Opslaan naar Firestore ────────────────────────────
  // Bestaande base64-afbeeldingen worden automatisch naar
  // Firebase Storage gemigreerd voor ze in Firestore belanden.

  async savePortfolio(cases: PortfolioCase[]): Promise<void> {
    const migrated = await this.migratePortfolioImages(cases);
    await setDoc(doc(this.firestore, 'site/data'), { portfolio: migrated }, { merge: true });
  }

  async saveBehandelingen(behandelingen: BehandelingCard[]): Promise<void> {
    const migrated = await this.migrateBehandelingenImages(behandelingen);
    await setDoc(doc(this.firestore, 'site/data'), { behandelingen: migrated }, { merge: true });
  }

  async saveTeksten(teksten: TekstenData): Promise<void> {
    await setDoc(doc(this.firestore, 'site/data'), { teksten }, { merge: true });
  }

  // ─── Foto uploaden naar Firebase Storage ───────────────

  async uploadImage(file: File, storagePath: string): Promise<string> {
    const blob = await this.compressToBlob(file);
    const storageRef = ref(this.storage, storagePath);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }

  // ─── Reset naar standaarddata ──────────────────────────

  async reset(): Promise<void> {
    const data = {
      portfolio:     JSON.parse(JSON.stringify(STANDAARD_PORTFOLIO)),
      behandelingen: JSON.parse(JSON.stringify(STANDAARD_BEHANDELINGEN)),
      teksten:       JSON.parse(JSON.stringify(STANDAARD_TEKSTEN)),
    };
    await setDoc(doc(this.firestore, 'site/data'), data);
    // Firestore-listener pikt dit op en updatet de subjects automatisch
  }

  // ─── Wachtwoord (blijft lokaal) ────────────────────────

  getWachtwoord(): string {
    return localStorage.getItem(LS_WACHTWOORD) ?? 'tandarts';
  }

  saveWachtwoord(pwd: string): void {
    if (pwd.trim()) localStorage.setItem(LS_WACHTWOORD, pwd.trim());
  }

  // ─── Hulpmethodes ──────────────────────────────────────

  nieuwId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /** Comprimeer File naar base64 (voor directe preview in beheer) */
  async compressImage(file: File, maxWidth = 1400): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
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

  /** Comprimeer File naar Blob (voor Storage-upload) */
  private compressToBlob(file: File, maxWidth = 1400): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const img = new Image();
        img.src = e.target!.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob mislukt')),
            'image/jpeg', 0.82
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  /** Converteer base64 data-URL naar Blob */
  private base64ToBlob(dataUrl: string): Blob {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  /** Upload base64-afbeeldingen in portfolio naar Storage */
  private async migratePortfolioImages(cases: PortfolioCase[]): Promise<PortfolioCase[]> {
    const result: PortfolioCase[] = JSON.parse(JSON.stringify(cases));
    for (const c of result) {
      for (const f of c.fotos) {
        if (f.src.startsWith('data:')) {
          const storageRef = ref(this.storage, `portfolio/${c.id}/${f.id}`);
          await uploadBytes(storageRef, this.base64ToBlob(f.src));
          f.src = await getDownloadURL(storageRef);
        }
      }
    }
    return result;
  }

  /** Upload base64-afbeeldingen in behandelingen naar Storage */
  private async migrateBehandelingenImages(behandelingen: BehandelingCard[]): Promise<BehandelingCard[]> {
    const result: BehandelingCard[] = JSON.parse(JSON.stringify(behandelingen));
    for (const b of result) {
      if (b.foto.startsWith('data:')) {
        const storageRef = ref(this.storage, `behandelingen/${b.id}`);
        await uploadBytes(storageRef, this.base64ToBlob(b.foto));
        b.foto = await getDownloadURL(storageRef);
      }
    }
    return result;
  }
}
