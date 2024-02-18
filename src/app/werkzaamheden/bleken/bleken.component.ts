import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-bleken',
  templateUrl: './bleken.component.html',
  styleUrl: './bleken.component.css'
})
export class BlekenComponent {
  @Input() photos: string[] = [
    'assets/img/bleken/bleken.jpeg',
  ];
}
