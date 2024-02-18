import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-kroon-brugwerk',
  templateUrl: './kroon-brugwerk.component.html',
  styleUrl: './kroon-brugwerk.component.css'
})
export class KroonBrugwerkComponent {
  @Input() photos: string[] = [
    'assets/img/kroonbrugwerk/brug1.jpeg',
    'assets/img/kroonbrugwerk/brug2.jpeg',
    'assets/img/kroonbrugwerk/brug3.jpeg',
    'assets/img/kroonbrugwerk/brug4.jpeg',
    'assets/img/kroonbrugwerk/brug5.jpeg',
    'assets/img/kroonbrugwerk/brug6.jpeg',
  ];
}
