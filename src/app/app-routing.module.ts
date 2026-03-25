import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AfspraakComponent } from './afspraak/afspraak.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { BeheerComponent } from './beheer/beheer.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'afspraak', component: AfspraakComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'beheer', component: BeheerComponent },
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
