import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export const SITE_URL  = 'https://www.mttandheelkunde.nl';
export const SITE_NAAM = 'MT Tandheelkunde';

export interface SeoData {
  title: string;
  description: string;
  /** Zet op false voor pagina's die niet in Google moeten (bijv. beheer). */
  index?: boolean;
  /** Absolute URL van de deelafbeelding; standaard een facings-foto. */
  image?: string;
}

/**
 * Zet per route de <title>, meta description, canonical-URL en social tags.
 * Werkt ook tijdens prerendering, zodat Google deze waarden direct in de HTML ziet.
 * De gegevens staan in `data.seo` van elke route in app-routing.module.ts.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  init(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        let r = this.route;
        while (r.firstChild) r = r.firstChild;
        const seo = r.snapshot.data['seo'] as SeoData | undefined;
        if (seo) this.apply(seo);
      });
  }

  /**
   * Voor pagina's waarvan de titel uit de data komt (bijv. een behandeling).
   * `pad` is het pad van de pagina, zoals "/behandelingen/facings".
   */
  set(seo: SeoData, pad: string): void {
    this.apply(seo, pad);
  }

  /** Plaatst (of verwijdert, bij `null`) een blok gestructureerde gegevens in de <head>. */
  setJsonLd(sleutel: string, data: object | null): void {
    const id = `ld-${sleutel}`;
    let script = this.document.getElementById(id);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private apply(seo: SeoData, pad = this.router.url.split(/[?#]/)[0]): void {
    const url = SITE_URL + (pad === '/' ? '/' : pad);

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: seo.index === false ? 'noindex, nofollow' : 'index, follow' });

    this.meta.updateTag({ property: 'og:type',        content: 'website' });
    this.meta.updateTag({ property: 'og:site_name',   content: SITE_NAAM });
    this.meta.updateTag({ property: 'og:locale',      content: 'nl_NL' });
    this.meta.updateTag({ property: 'og:title',       content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url',         content: url });
    this.meta.updateTag({ property: 'og:image',       content: seo.image ?? `${SITE_URL}/assets/img/facings/facings1.jpeg` });

    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
