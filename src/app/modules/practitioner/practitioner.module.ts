import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PractitionerComponent } from './practitioner.component';
import { PractitionerPhotoDialogComponent } from './practitioner-photo-dialog/practitioner-photo-dialog.component';

import { SearchHeaderModule, PractitionerCardModule, LoadingModule, DialogModule, PractitionerPhotoChooserModule } from 'front-end-common';
import { PractitionerModule as FrontEndPractitionerModule } from 'front-end-common';

import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: PractitionerComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SearchHeaderModule,
    PractitionerCardModule,
    LoadingModule,
    DialogModule,
    PractitionerPhotoChooserModule,
    FrontEndPractitionerModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [PractitionerComponent, PractitionerPhotoDialogComponent]
})
export class PractitionerModule { }
