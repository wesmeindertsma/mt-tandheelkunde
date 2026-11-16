import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehandelingCard, DataService, behandelingSlug } from '../../services/data.service';

@Component({
  standalone: false,
  selector: 'app-wat-ik-doe',
  templateUrl: './wat-ik-doe.component.html',
  styleUrl: './wat-ik-doe.component.css'
})
export class WatIkDoeComponent implements OnInit, OnDestroy {
  behandelingen: BehandelingCard[] = [];
  readonly slug = behandelingSlug;

  private sub!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.sub = this.dataService.behandelingen$.subscribe(b => this.behandelingen = b);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
