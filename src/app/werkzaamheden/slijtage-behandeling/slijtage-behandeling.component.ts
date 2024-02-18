import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-slijtage-behandeling',
  templateUrl: './slijtage-behandeling.component.html',
  styleUrl: './slijtage-behandeling.component.css'
})
export class SlijtageBehandelingComponent {
  @Input() photos: string[] = [
    'assets/img/slijtage/slijtage1.jpeg',
    'assets/img/slijtage/slijtage2.jpeg',
    'assets/img/slijtage/slijtage3.jpeg',
  ];

  constructor(private http: HttpClient) { }

  getImagesFromFolder(folderPath: string): Observable<string[]> {
    // Voeg hier het pad naar de map met de foto's in
    const baseUrl = 'http://example.com/images/';
    const fullPath = baseUrl + folderPath;

    // Hieronder wordt een request gemaakt om alle bestanden in de map op te halen
    return this.http.get<string[]>(fullPath);
  }
}
