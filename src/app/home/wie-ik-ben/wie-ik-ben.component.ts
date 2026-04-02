import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, TekstenData } from '../../services/data.service';

@Component({
  standalone: false,
  selector: 'app-wie-ik-ben',
  templateUrl: './wie-ik-ben.component.html',
  styleUrl: './wie-ik-ben.component.css'
})
export class WieIkBenComponent implements OnInit, OnDestroy {
  teksten!: TekstenData;

  private sub!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.sub = this.dataService.teksten$.subscribe(t => this.teksten = t);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
