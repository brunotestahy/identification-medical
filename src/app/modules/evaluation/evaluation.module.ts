import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationComponent } from './evaluation.component';
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
         PractitionerService,
         AppointmentService,
         SelectModule,
         RatingService,
         RegionalCouncilModule
        } from 'front-end-common';
import { PractitionerModule as FrontEndPractitionerModule } from 'front-end-common';

import { PractitionerRoleService } from '../practitioner/practitioner-role.service';

import { RouterModule, Routes } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule} from '@angular/forms';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';


const routes: Routes = [
  { path: '', component: EvaluationComponent }
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
    ReactiveFormsModule,
    NgbModule,
    DialogModule,
    PractitionerThumbnailModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    RegionalCouncilModule
  ],
  declarations: [EvaluationComponent, EvaluationFormComponent],
  providers: [
    PractitionerRoleService,
    PractitionerService,
    AppointmentService,
    RatingService
  ]
})
export class EvaluationModule { }
