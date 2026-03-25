import { Component, HostListener, OnInit } from '@angular/core';
import { DataService, PortfolioCase, PortfolioFotoItem } from '../services/data.service';

@Component({
  standalone: false,
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  cases: PortfolioCase[] = [];

  activeCaseId: string | null = null;
  activeFotoIndex = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.cases = this.dataService.getPortfolio();
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
