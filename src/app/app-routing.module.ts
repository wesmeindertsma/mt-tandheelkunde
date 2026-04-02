import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AfspraakComponent } from './afspraak/afspraak.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'contact', component: ContactComponent },
  { path: 'afspraak', component: AfspraakComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'beheer', loadChildren: () => import('./beheer/beheer.module').then(m => m.BeheerModule) },
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
