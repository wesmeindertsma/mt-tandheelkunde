import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AfspraakComponent } from './afspraak/afspraak.component';
import { HomeComponent } from './home/home.component';
import { WieIkBenComponent } from './home/wie-ik-ben/wie-ik-ben.component';
import { WatIkDoeComponent } from './home/wat-ik-doe/wat-ik-doe.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactComponent } from './components/contact/contact.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PortfolioComponent } from './portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WieIkBenComponent,
    WatIkDoeComponent,
    HeaderComponent,
    NavbarComponent,
    ContactComponent,
    AfspraakComponent,
    PortfolioComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
