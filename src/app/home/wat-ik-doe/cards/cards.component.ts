import {Component, Input, OnInit} from '@angular/core';
import {Card} from "./card";

@Component({
  standalone: false,
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit{
  @Input() cards?: Card[];

  constructor() {
  }

  ngOnInit(): void {
  }


}
