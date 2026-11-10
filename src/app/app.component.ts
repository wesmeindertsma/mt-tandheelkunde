import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './services/seo.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MT-Tandheelkunde';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    seo: SeoService,
  ) {
    seo.init();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll naar boven bij elke navigatie tenzij er een fragment is
      // (fragment-scroll wordt afgehandeld door HomeComponent)
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (!fragment) {
        window.scrollTo(0, 0);
      }
    });
  }
}
