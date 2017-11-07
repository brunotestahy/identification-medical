import { Component, OnInit, Input } from '@angular/core';
import { Patient, Practitioner, PatientService } from 'front-end-common';

const ASSISTANT = 'assistant';
const ASSOCIATED = 'associated';

@Component({
  templateUrl: './care-provider-card.component.html',
  selector: 'app-care-provider-card',
  styleUrls: ['./care-provider-card.component.css']
})
export class CareProviderCardComponent implements OnInit {

  private _patient: Patient;

  loading: boolean;
  success: boolean;
  error: boolean;

  @Input() set patient(value: any) {
    this._patient = value as Patient;
  }

  get patient() {
    return this._patient;
  }

  currentYear: number;
  currentMonth: number;

  constructor(private pService: PatientService) { }

  ngOnInit() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.loading = false;
    this.success = false;
    this.error = false;
  }

  getBirthdate(): Date {
    const birthDate = this.patient.birthDate;
    if (birthDate != null && birthDate.dateTime != null) {
      return new Date(birthDate.dateTime);
    }
    return null;
  }

  getAge(): number {
    const birthDate = this.patient.birthDate;
    if (birthDate != null && birthDate.dateTime != null) {
      const patientDate = new Date(birthDate.dateTime);
      const patientYear = patientDate.getFullYear();
      const patientMonth = patientDate.getMonth();
      let age = this.currentYear - patientYear;
      if (patientMonth > this.currentMonth) {
        age--;
      }
      return age;
    }
    return null;
  }

  getPractitioner(key: string): Practitioner {
    if (this._patient.careProviders != null) {
      return this._patient.careProviders[key];
    }
    return null;
  }

  getAssistantMedic(): Practitioner {
    return this.getPractitioner(ASSISTANT);
  }

  getAssociatedMedic(): Practitioner {
    return this.getPractitioner(ASSOCIATED);
  }

  updateCardZindex(content) {
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
      (cards[i] as HTMLDivElement).style.zIndex = null;
    }
    content.parentNode.style.zIndex = 2;
  }

  setAssistant(prac: Practitioner) {
    this.setPractitioner(prac, ASSISTANT);
  }

  setAssociated(prac: Practitioner) {
    this.setPractitioner(prac, ASSOCIATED);
  }

  setPractitioner(prac: Practitioner, key: string) {
    this.loading = true;
    this.pService.addCareProvider(this._patient.id, prac.id, key).subscribe(
      () => {
        if (this._patient.careProviders == null) {
          this._patient.careProviders = new Map<string, Practitioner>();
        }
        if (this._patient.careProviderIds == null) {
          this._patient.careProviderIds = new Map<string, string>();
        }
        this._patient.careProviders[key] = prac;
        this._patient.careProviderIds[key] = prac.id;
        this.loading = false;
        this.success = true;
      },
      () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 4000);
      }
    );
  }

  onRemoveAssitant(prac: Practitioner) {
    this.onRemovePractitioner(prac, ASSISTANT);
  }

  onRemoveAssociated(prac: Practitioner) {
    this.onRemovePractitioner(prac, ASSOCIATED);
  }

  onRemovePractitioner(prac: Practitioner, key: string) {
    this.loading = true;
    this.pService.removeCareProvider(this._patient.id, prac.id, key).subscribe(
      () => {
        this.loading = false;
        delete this._patient.careProviderIds[key];
        delete this._patient.careProviders[key];
      },
      () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 4000);
      }
    );
  }

}
