import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-facings',
  templateUrl: './facings.component.html',
  styleUrl: './facings.component.css'
})
export class FacingsComponent {
  @Input() photos: string[] = [
    'assets/img/facings/facings1.jpeg',
    'assets/img/facings/facings2.jpeg',
    'assets/img/facings/facings3.jpeg',
  ];
}
