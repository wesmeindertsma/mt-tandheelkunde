import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MT-Tandheelkunde';

  constructor(private router: Router) {}

  ngOnInit(): void {
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
