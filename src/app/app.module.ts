import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AfspraakComponent } from './afspraak/afspraak.component';
import { HomeComponent } from './home/home.component';
import { WieIkBenComponent } from './home/wie-ik-ben/wie-ik-ben.component';
import { WatIkDoeComponent } from './home/wat-ik-doe/wat-ik-doe.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactComponent } from './components/contact/contact.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const firebaseConfig = {
  apiKey: 'AIzaSyAB74FEHFNVs_qAxOUNW2lGjUhhwSqYjU0',
  authDomain: 'mttandheelkunde.firebaseapp.com',
  projectId: 'mttandheelkunde',
  storageBucket: 'mttandheelkunde.firebasestorage.app',
  messagingSenderId: '932978857405',
  appId: '1:932978857405:web:40938c2615815e2f526ed4',
};

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
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
