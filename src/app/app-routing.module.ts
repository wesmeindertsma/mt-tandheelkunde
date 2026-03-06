import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {BlekenComponent} from "./werkzaamheden/bleken/bleken.component";
import {ContactComponent} from "./components/contact/contact.component";
import {SlijtageBehandelingComponent} from "./werkzaamheden/slijtage-behandeling/slijtage-behandeling.component";
import {KroonBrugwerkComponent} from "./werkzaamheden/kroon-brugwerk/kroon-brugwerk.component";
import {FacingsComponent} from "./werkzaamheden/facings/facings.component";
import {AfspraakComponent} from "./afspraak/afspraak.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
  { path: 'home', component: HomeComponent },
  { path: 'bleken', component: BlekenComponent },
  { path: 'slijtage', component: SlijtageBehandelingComponent },
  { path: 'kroon-brugwerk', component: KroonBrugwerkComponent },
  { path: 'facings', component: FacingsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'afspraak', component: AfspraakComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
