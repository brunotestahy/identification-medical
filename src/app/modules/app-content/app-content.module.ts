import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContentComponent } from './app-content.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule, SearchHeaderModule, PractitionerNameModule, NavigationModule, LoginModule, LoadingModule } from 'front-end-common';
import { MenuModule } from 'front-end-common';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SearchHeaderModule,
    PractitionerNameModule,
    NavigationModule,
    LoginModule,
    MenuModule,
    LoadingModule,
    RouterModule.forChild([{
      path: '',
      component: AppContentComponent,
      children: [
        { path: 'practitioner', loadChildren: '../practitioner/practitioner.module#PractitionerModule' },
        { path: 'patient', loadChildren: '../patient/patient.module#PatientModule' },
        // { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
        { path: 'forbidden', component: ForbiddenComponent }
      ]
    }]),
    TranslateModule.forChild()
  ],
  declarations: [AppContentComponent, ForbiddenComponent]
})
export class AppContentModule { }
