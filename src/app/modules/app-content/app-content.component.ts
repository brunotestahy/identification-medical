import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Practitioner, LoginService } from 'front-end-common';
import { PatientChecker } from '../patient-checker';
import { environment, Environment } from '../../../environments/environment';

@Component({
  selector: 'app-app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.css']
})
export class AppContentComponent extends PatientChecker {
  name: string;
  practitionerEnable: boolean;
  patientEnable: boolean;

  constructor(protected loginService: LoginService, protected router: Router) {
    super(loginService, router);

    this.practitionerEnable = false;
    this.patientEnable = false;

    this.loginService.getMeSubject().subscribe(me => {
      if (me != null && !this.loginService.isPatient()) {
        this.loadPractitionerName(me);
        this.loadPermissions();
      }
    });
  }

  loadPractitionerName(employee: any) {
    this.name = employee.dto.fullName;
  }

  loadPermissions() {
    this.practitionerEnable = this.loginService.hasPermission('IDENTIFICATION_PRACTITIONER', 'READ');
    this.patientEnable = this.loginService.hasPermission('IDENTIFICATION_PATIENT', 'READ');
  }

  getCarePlanPath() {
    return (environment as Environment).carePlanPath;
  }

  getSmartPath() {
    return (environment as Environment).smartPath;
  }

  isHidden() {
    return this.type == null || this.type === 'patient';
  }
}
