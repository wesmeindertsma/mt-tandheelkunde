import { Component, OnInit } from '@angular/core';
import { BehandelingCard, DataService } from '../../services/data.service';

@Component({
  standalone: false,
  selector: 'app-wat-ik-doe',
  templateUrl: './wat-ik-doe.component.html',
  styleUrl: './wat-ik-doe.component.css'
})
export class WatIkDoeComponent implements OnInit {
  behandelingen: BehandelingCard[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.behandelingen = this.dataService.getBehandelingen();
  }
}
