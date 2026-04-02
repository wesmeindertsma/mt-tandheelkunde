import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehandelingCard, DataService } from '../../services/data.service';

@Component({
  standalone: false,
  selector: 'app-wat-ik-doe',
  templateUrl: './wat-ik-doe.component.html',
  styleUrl: './wat-ik-doe.component.css'
})
export class WatIkDoeComponent implements OnInit, OnDestroy {
  behandelingen: BehandelingCard[] = [];
  activeBehandeling: BehandelingCard | null = null;

  private sub!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.sub = this.dataService.behandelingen$.subscribe(b => this.behandelingen = b);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    document.body.style.overflow = '';
  }

  openModal(b: BehandelingCard): void {
    this.activeBehandeling = b;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeBehandeling = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }
}
