import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule,
         PractitionerNameModule,
         NavigationModule,
         LoginModule,
         GreetingModule,
         SearchHeaderModule,
         LoadingModule,
         PractitionerCardModule,
         DialogModule,
         MenuModule,
         PractitionerThumbnailModule,
         SelectModule } from 'front-end-common';
import { PractitionerModule as FrontEndPractitionerModule } from 'front-end-common';

import { PractitionerRoleService } from '../practitioner/practitioner-role.service';

import { RouterModule, Routes } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule} from '@angular/material';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SearchHeaderModule,
    PractitionerNameModule,
    NavigationModule,
    LoginModule,
    MenuModule,
    GreetingModule,
    SelectModule,
    LoadingModule,
    PractitionerCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DialogModule,
    PractitionerThumbnailModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [DashboardComponent],
  providers: [
    PractitionerRoleService
  ]
})
export class DashboardModule { }
