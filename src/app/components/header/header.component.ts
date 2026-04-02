import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, TekstenData } from '../../services/data.service';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  teksten!: TekstenData;

  private sub!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.sub = this.dataService.teksten$.subscribe(t => this.teksten = t);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  scrollTo(fragment: string): void {
    const el = document.getElementById(fragment);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
