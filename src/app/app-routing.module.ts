import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AfspraakComponent } from './afspraak/afspraak.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SeoData } from './services/seo.service';

// Titels en beschrijvingen zoals ze in Google verschijnen.
// Houd titels rond de 60 tekens en beschrijvingen rond de 155 tekens.
const SEO: Record<string, SeoData> = {
  home: {
    title: 'Esthetische en restauratieve tandheelkunde in Groningen | MT Tandheelkunde',
    description: 'Tandarts Marynthe Tijink is gespecialiseerd in esthetische en restauratieve tandheelkunde: facings, bleken, kroon- en brugwerk en slijtagebehandeling in Appingedam, Groningen.',
  },
  portfolio: {
    title: 'Portfolio: facings, kroon- en brugwerk en bleken | MT Tandheelkunde',
    description: 'Bekijk voor- en na-foto\'s van esthetische en restauratieve behandelingen: facings, kroon- en brugwerk, gebitsslijtage en bleken door tandarts Marynthe Tijink.',
  },
  afspraak: {
    title: 'Afspraak maken of patiënt doorverwijzen | MT Tandheelkunde',
    description: 'Maak een afspraak voor esthetische of restauratieve tandheelkunde, of verwijs als tandarts een patiënt door naar Marynthe Tijink in Appingedam (Groningen).',
  },
  contact: {
    title: 'Contact en openingstijden | MT Tandheelkunde Appingedam',
    description: 'Marynthe Tijink werkt bij PUUR Mondzorg, Spoorbaan 1, 9901 DD Appingedam. Bel 0596 219 219 of bekijk de openingstijden en route.',
  },
  beheer: {
    title: 'Beheer | MT Tandheelkunde',
    description: 'Beheeromgeving',
    index: false,
  },
};

const routes: Routes = [
  { path: '', component: HomeComponent, data: { seo: SEO['home'] } },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'contact', component: ContactComponent, data: { seo: SEO['contact'] } },
  { path: 'afspraak', component: AfspraakComponent, data: { seo: SEO['afspraak'] } },
  { path: 'portfolio', component: PortfolioComponent, data: { seo: SEO['portfolio'] } },
  { path: 'beheer', data: { seo: SEO['beheer'] }, loadChildren: () => import('./beheer/beheer.module').then(m => m.BeheerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'disabled',        // Wordt afgehandeld door HomeComponent
    scrollPositionRestoration: 'disabled', // Wordt afgehandeld door AppComponent
    scrollOffset: [0, 80]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
