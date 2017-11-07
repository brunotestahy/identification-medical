import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContentComponent } from './app-content.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule, SearchHeaderModule, PractitionerNameModule, NavigationModule, LoginModule } from 'front-end-common';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SearchHeaderModule,
    PractitionerNameModule,
    NavigationModule,
    LoginModule,
    RouterModule.forChild([{
      path: '',
      component: AppContentComponent,
      children: [
        { path: 'practitioner', loadChildren: '../practitioner/practitioner.module#PractitionerModule' },
        { path: 'patient', loadChildren: '../patient/patient.module#PatientModule' }
      ]
    }]),
    TranslateModule.forChild()
  ],
  declarations: [AppContentComponent]
})
export class AppContentModule { }
