import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore, doc, setDoc, onSnapshot,
  collection, query, orderBy, writeBatch, getDocs,
} from '@angular/fire/firestore';

export interface PortfolioFotoItem {
  id: string;
  src: string;      // base64 of assets-pad voor standaardfotos
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

const LS_PORTFOLIO     = 'mt_portfolio_v1';
const LS_BEHANDELINGEN = 'mt_behandelingen_v1';
const LS_TEKSTEN       = 'mt_teksten_v1';
const LS_WACHTWOORD    = 'mt_beheer_pwd';

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

  private unsubMeta:      (() => void) | undefined;
  private unsubPortfolio: (() => void) | undefined;

  constructor(private firestore: Firestore) {
    // Real-time listener: behandelingen + teksten
    this.unsubMeta = onSnapshot(doc(this.firestore, 'site/data'), snap => {
      const d = snap.data();
      if (!d) return;
      if (Array.isArray(d['behandelingen'])) {
        localStorage.setItem(LS_BEHANDELINGEN, JSON.stringify(d['behandelingen']));
        this._behandelingen$.next(d['behandelingen']);
      }
      if (d['teksten']) {
        localStorage.setItem(LS_TEKSTEN, JSON.stringify(d['teksten']));
        this._teksten$.next(d['teksten']);
      }
    });

    // Real-time listener: portfolio cases (gesorteerd op volgorde)
    this.unsubPortfolio = onSnapshot(
      query(collection(this.firestore, 'portfolioCases'), orderBy('order')),
      snapshot => {
        const cases = snapshot.docs.map(d => {
          const { order: _order, ...rest } = d.data();
          return rest as PortfolioCase;
        });
        localStorage.setItem(LS_PORTFOLIO, JSON.stringify(cases));
        this._portfolio$.next(cases);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubMeta?.();
    this.unsubPortfolio?.();
  }

  // ─── Synchrone snapshots (voor beheer-initialisatie) ───

  getPortfolio(): PortfolioCase[]       { return this._portfolio$.value; }
  getBehandelingen(): BehandelingCard[] { return this._behandelingen$.value; }
  getTeksten(): TekstenData             { return this._teksten$.value; }

  // ─── Opslaan naar Firestore ────────────────────────────

  async savePortfolio(cases: PortfolioCase[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    // Verwijder cases die niet meer bestaan
    const existing = await getDocs(collection(this.firestore, 'portfolioCases'));
    const nieuweIds = new Set(cases.map(c => c.id));
    for (const d of existing.docs) {
      if (!nieuweIds.has(d.id)) batch.delete(d.ref);
    }

    // Sla alle huidige cases op met volgordenummer
    cases.forEach((c, index) => {
      batch.set(doc(this.firestore, 'portfolioCases', c.id), { ...c, order: index });
    });

    await batch.commit();
  }

  async saveBehandelingen(behandelingen: BehandelingCard[]): Promise<void> {
    await setDoc(doc(this.firestore, 'site/data'), { behandelingen }, { merge: true });
  }

  async saveTeksten(teksten: TekstenData): Promise<void> {
    await setDoc(doc(this.firestore, 'site/data'), { teksten }, { merge: true });
  }

  // ─── Reset naar standaarddata ──────────────────────────

  async reset(): Promise<void> {
    const batch = writeBatch(this.firestore);

    // Verwijder bestaande portfolio cases
    const existing = await getDocs(collection(this.firestore, 'portfolioCases'));
    for (const d of existing.docs) batch.delete(d.ref);

    // Zet standaard portfolio terug
    const stdPortfolio: PortfolioCase[] = JSON.parse(JSON.stringify(STANDAARD_PORTFOLIO));
    stdPortfolio.forEach((c, index) => {
      batch.set(doc(this.firestore, 'portfolioCases', c.id), { ...c, order: index });
    });

    // Zet meta terug
    batch.set(doc(this.firestore, 'site/data'), {
      behandelingen: JSON.parse(JSON.stringify(STANDAARD_BEHANDELINGEN)),
      teksten:       JSON.parse(JSON.stringify(STANDAARD_TEKSTEN)),
    });

    await batch.commit();
  }

  // ─── Hulpmethodes ──────────────────────────────────────

  nieuwId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /** Comprimeer afbeelding naar base64 voor Firestore-opslag */
  compressImage(file: File, maxWidth = 900): Promise<string> {
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
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  // ─── Wachtwoord (blijft lokaal) ────────────────────────

  getWachtwoord(): string {
    return localStorage.getItem(LS_WACHTWOORD) ?? 'tandarts';
  }

  saveWachtwoord(pwd: string): void {
    if (pwd.trim()) localStorage.setItem(LS_WACHTWOORD, pwd.trim());
  }
}
