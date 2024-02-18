import { Injectable } from '@angular/core';
import {InMemoryDbService} from "angular-in-memory-web-api";

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  constructor() { }

  createDb() {
    let werkzaamheden = [
      {titel: 'Bleken en witte vlekken',
        omschrijving: 'Tanden laten bleken bij de tandarts is de meest effectieve methode om de tanden witter te maken. Alleen bij tandartsen mag u namelijk uw tanden laten bleken met 6% waterstofperoxide.',
        url: '/bleken',
        imageUrl: 'assets/img/bleken/bleken.jpeg'},
      {titel: 'Facings',
        omschrijving: 'Een facings is een dun schildje, van composiet of porselein, dat geplaatst wordt op een tand of kies. Daarmee kan de vorm en kleur van een tand of kies aangepast worden. ',
        url: '/facings',
        imageUrl: 'assets/img/facings/facings1.jpeg'},
      {titel: 'Kroon-brugwerk',
        omschrijving: 'Een kroon is een overkappend dopje over een natuurlijke tand of kies en geeft daarmee stevigheid. Soms is een tand of kies zo beschadigd, dat het hersteld moet worden middels een kroon.',
        url: '/kroon-brugwerk',
        imageUrl: 'assets/img/kroonbrugwerk/brug1.jpeg'},
      {titel: 'Slijtage',
        omschrijving: 'Gebitsslijtage ontstaat door verlies van tandweefsel door oorzaken anders dan cariës (gaatjes, tandbederf).',
        url: '/slijtage',
        imageUrl: 'assets/img/slijtage/slijtage2.jpeg'}
    ];
    return {werkzaamheden};
  }
}
