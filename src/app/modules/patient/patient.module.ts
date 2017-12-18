import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient.component';
import { CareProviderCardComponent } from './care-provider-card/care-provider-card.component';
import { PractitionerChooserComponent } from './practitioner-chooser/practitioner-chooser.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchHeaderModule, LoadingModule, CardModule, ConceptmapModule, RulesCalendarModule } from 'front-end-common';
import { PatientModule as FrontEndPatientModule, PractitionerModule } from 'front-end-common';
import { RoomModule, SelectModule } from 'front-end-common';

import {MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MAT_DATE_LOCALE} from '@angular/material';

import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { PatientCachedService } from './patient-cached.service';

import { AppointmentModule } from 'front-end-common';

const routes: Routes = [
  { path: '', component: PatientComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SearchHeaderModule,
    LoadingModule,
    CardModule,
    FrontEndPatientModule,
    ConceptmapModule,
    RoomModule,
    SelectModule,
    PractitionerModule,
    RulesCalendarModule,
    AppointmentModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    PatientCachedService,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  declarations: [PatientComponent, CareProviderCardComponent, PractitionerChooserComponent]
})
export class PatientModule { }
