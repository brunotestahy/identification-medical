import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient.component';
import { CareProviderCardComponent } from './care-provider-card/care-provider-card.component';
import { PractitionerChooserComponent } from './practitioner-chooser/practitioner-chooser.component';

import { SearchHeaderModule, LoadingModule, CardModule, PatientService, ConceptmapModule } from 'front-end-common';
import { PatientModule as FrontEndPatientModule, PractitionerModule } from 'front-end-common';
import { RoomModule, SelectModule } from 'front-end-common';

import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

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
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [PatientComponent, CareProviderCardComponent, PractitionerChooserComponent]
})
export class PatientModule { }
