import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY  = 'lPe4mE37SaC3xMFnn';
const EMAILJS_SERVICE_ID  = 'service_te9eflm';
const EMAILJS_TEMPLATE_ID = 'template_ylska8w';

@Component({
  standalone: false,
  selector: 'app-afspraak',
  templateUrl: './afspraak.component.html',
  styleUrls: ['./afspraak.component.css']
})
export class AfspraakComponent implements OnInit {
  afspraakForm: FormGroup;
  verzonden    = false;
  isVerzenden  = false;
  verzendFout  = false;
  today = new Date().toISOString().split('T')[0];

  behandelingen = [
    'Bleken en witte vlekken',
    'Facings',
    'Kroon- en brugwerk',
    'Slijtagebehandeling',
    'Anders / Algemeen'
  ];

  constructor(private fb: FormBuilder) {
    this.afspraakForm = this.fb.group({
      formulierType: ['afspraak'],
      voornaam:      ['', [Validators.required, Validators.minLength(2)]],
      achternaam:    ['', [Validators.required, Validators.minLength(2)]],
      email:         ['', [Validators.required, Validators.email]],
      telefoon:      ['', [Validators.required, Validators.pattern(/^[0-9\s\+\-]{8,}$/)]],
      praktijkNaam:  [''],
      patientNaam:   [''],
      behandeling:   ['', Validators.required],
      datum:         [''],
      bericht:       [''],
      privacy:       [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.f['formulierType'].valueChanges.subscribe((type: string) => {
      const patientNaam = this.f['patientNaam'];
      if (type === 'doorverwijzing') {
        patientNaam.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        patientNaam.clearValidators();
        patientNaam.setValue('');
        this.f['praktijkNaam'].setValue('');
      }
      patientNaam.updateValueAndValidity();
    });
  }

  get f() {
    return this.afspraakForm.controls;
  }

  get isDoorverwijzing(): boolean {
    return this.f['formulierType'].value === 'doorverwijzing';
  }

  onSubmit(): void {
    if (this.afspraakForm.invalid) {
      this.afspraakForm.markAllAsTouched();
      return;
    }

    this.isVerzenden = true;
    this.verzendFout = false;

    const v = this.afspraakForm.value;

    const templateParams = this.isDoorverwijzing
      ? {
          doorverwijzing:  'Ja',
          voornaam:        v.voornaam,
          achternaam:      v.achternaam,
          email:           v.email,
          telefoon:        v.telefoon,
          praktijkNaam:    v.praktijkNaam || '—',
          patientNaam:     v.patientNaam,
          behandeling:     v.behandeling,
          datum:           v.datum || '—',
          bericht:         v.bericht || '—',
          reply_to:        v.email
        }
      : {
          doorverwijzing:  'Nee',
          voornaam:        v.voornaam,
          achternaam:      v.achternaam,
          email:           v.email,
          telefoon:        v.telefoon,
          praktijkNaam:    '—',
          patientNaam:     '—',
          behandeling:     v.behandeling,
          datum:           v.datum || '—',
          bericht:         v.bericht || '—',
          reply_to:        v.email
        };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => {
        this.verzonden   = true;
        this.isVerzenden = false;
      })
      .catch(() => {
        this.verzendFout  = true;
        this.isVerzenden  = false;
      });
  }
}
