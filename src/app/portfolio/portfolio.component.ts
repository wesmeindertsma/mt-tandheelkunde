import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, PortfolioCase, PortfolioFotoItem } from '../services/data.service';

@Component({
  standalone: false,
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  cases: PortfolioCase[] = [];

  activeCaseId: string | null = null;
  activeFotoIndex = 0;

  slideIndices: Record<string, number> = {};
  slideNextIndices: Record<string, number> = {};
  slideFading: Record<string, boolean> = {};

  private sub!: Subscription;
  private slideTimer: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.sub = this.dataService.portfolio$.subscribe(cases => {
      this.cases = cases;
      cases.forEach(c => {
        this.slideIndices[c.id] = 0;
        this.slideNextIndices[c.id] = 0;
      });
      this.startSlideshow();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearInterval(this.slideTimer);
  }

  private startSlideshow(): void {
    clearInterval(this.slideTimer);
    this.slideTimer = setInterval(() => {
      if (this.activeCaseId) return;
      this.cases.forEach(c => {
        if (c.fotos.length < 2) return;
        const nextIdx = (this.slideIndices[c.id] + 1) % c.fotos.length;
        // Zet het volgende plaatje klaar (nog onzichtbaar)
        this.slideNextIndices[c.id] = nextIdx;
        // Volgende tick: start de crossfade
        setTimeout(() => {
          this.slideFading[c.id] = true;
          // Na de fade-in: zet de achtergrond gelijk en verberg de overlay
          setTimeout(() => {
            this.slideIndices[c.id] = nextIdx;
            setTimeout(() => { this.slideFading[c.id] = false; }, 50);
          }, 1200);
        }, 50);
      });
    }, 5000);
  }

  currentSlide(c: PortfolioCase): PortfolioFotoItem {
    return c.fotos[this.slideIndices[c.id] ?? 0];
  }

  nextSlide(c: PortfolioCase): PortfolioFotoItem {
    return c.fotos[this.slideNextIndices[c.id] ?? 0];
  }

  /** Platte lijst van alle foto's voor het grid */
  get gridFotos(): { caseId: string; fotoId: string; src: string; behandeling: string }[] {
    return this.cases.flatMap(c =>
      c.fotos.map(f => ({ caseId: c.id, fotoId: f.id, src: f.src, behandeling: c.behandeling }))
    );
  }

  thumbnail(c: PortfolioCase): PortfolioFotoItem {
    return c.fotos.find(f => f.id === c.thumbnailId) ?? c.fotos[0];
  }

  get activeCase(): PortfolioCase | null {
    return this.cases.find(c => c.id === this.activeCaseId) ?? null;
  }

  get activeFoto(): PortfolioFotoItem | null {
    return this.activeCase?.fotos[this.activeFotoIndex] ?? null;
  }

  openCarousel(caseId: string, fotoId: string): void {
    this.activeCaseId = caseId;
    const c = this.cases.find(c => c.id === caseId);
    this.activeFotoIndex = c ? c.fotos.findIndex(f => f.id === fotoId) : 0;
  }

  vorige(): void {
    if (this.activeFotoIndex > 0) this.activeFotoIndex--;
  }

  volgende(): void {
    if (this.activeCase && this.activeFotoIndex < this.activeCase.fotos.length - 1) {
      this.activeFotoIndex++;
    }
  }

  sluit(): void {
    this.activeCaseId = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (!this.activeCaseId) return;
    if (e.key === 'Escape') this.sluit();
    if (e.key === 'ArrowLeft') this.vorige();
    if (e.key === 'ArrowRight') this.volgende();
  }
}
