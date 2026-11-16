import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { BehandelingCard, DataService, behandelingSlug } from '../services/data.service';
import { SeoService, SITE_URL } from '../services/seo.service';

/** Een tekstblok uit de detailtekst: optionele kop met alinea's of een lijstje. */
interface Blok {
  kop?: string;
  regels: string[];
  lijst: boolean;
}

/**
 * Eigen pagina per behandeling (/behandelingen/:slug). De volledige uitleg staat
 * hierdoor in de vooraf gegenereerde HTML, zodat Google en AI-assistenten hem kunnen lezen.
 */
@Component({
  standalone: false,
  selector: 'app-behandeling',
  templateUrl: './behandeling.component.html',
  styleUrl: './behandeling.component.css'
})
export class BehandelingComponent implements OnInit, OnDestroy {
  behandeling: BehandelingCard | null = null;
  andere: { titel: string; slug: string }[] = [];
  blokken: Blok[] = [];
  toonIntro = true;
  geladen = false;

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([this.route.paramMap, this.dataService.behandelingen$])
      .subscribe(([params, lijst]) => {
        const slug = params.get('slug') ?? '';
        const b = lijst.find(x => behandelingSlug(x) === slug || x.id === slug) ?? null;
        this.behandeling = b;
        this.geladen = true;
        this.andere = lijst
          .filter(x => x !== b && x.titel)
          .map(x => ({ titel: x.titel, slug: behandelingSlug(x) }));
        this.blokken = b ? this.splitsTekst(b.detailTekst ?? '') : [];
        this.toonIntro = !!b && !this.beginsMetIntro(b);
        this.zetSeo(b, slug);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.seo.setJsonLd('behandeling', null);
  }

  private zetSeo(b: BehandelingCard | null, slug: string): void {
    const pad = `/behandelingen/${b ? behandelingSlug(b) : slug}`;
    if (!b) {
      this.seo.set({ title: 'Behandeling niet gevonden | MT Tandheelkunde', description: 'Deze behandeling bestaat niet (meer).', index: false }, pad);
      this.seo.setJsonLd('behandeling', null);
      return;
    }

    const url = SITE_URL + pad;
    const afbeelding = b.foto && !b.foto.startsWith('data:') ? `${SITE_URL}/${b.foto.replace(/^\//, '')}` : undefined;
    const beschrijving = b.beschrijving.length > 155 ? b.beschrijving.slice(0, 152).trimEnd() + '…' : b.beschrijving;

    this.seo.set({
      title: `${b.titel} in Appingedam (Groningen) | MT Tandheelkunde`,
      description: beschrijving,
      image: afbeelding,
    }, pad);

    this.seo.setJsonLd('behandeling', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${url}#behandeling`,
          name: b.titel,
          serviceType: b.titel,
          description: b.beschrijving,
          url,
          ...(afbeelding ? { image: afbeelding } : {}),
          provider: { '@id': `${SITE_URL}/#praktijk` },
          areaServed: ['Appingedam', 'Delfzijl', 'Groningen'],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Behandelingen', item: `${SITE_URL}/#wat-ik-doe` },
            { '@type': 'ListItem', position: 3, name: b.titel, item: url },
          ],
        },
      ],
    });
  }

  /** Detailtekst uit beheer: blokken gescheiden door een lege regel; een korte eerste regel is een kop. */
  private splitsTekst(tekst: string): Blok[] {
    return tekst.split(/\n\s*\n/).map(stuk => {
      const regels = stuk.split('\n').map(r => r.trim()).filter(Boolean);
      const heeftKop = regels.length > 1 && regels[0].length <= 60 && !/[.!?:]$/.test(regels[0]);
      const kop = heeftKop ? regels.shift() : undefined;
      return { kop, regels, lijst: regels.length > 1 };
    }).filter(b => b.regels.length);
  }

  /** Voorkomt dat de korte beschrijving dubbel staat als de detailtekst er al mee begint. */
  private beginsMetIntro(b: BehandelingCard): boolean {
    const begin = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').slice(0, 40);
    return !!b.detailTekst && begin(b.detailTekst).includes(begin(b.beschrijving).slice(0, 25));
  }
}
