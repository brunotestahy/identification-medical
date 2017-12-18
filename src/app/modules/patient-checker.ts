import { UserLoader, LoginService } from 'front-end-common';
import { Router } from '@angular/router';

export abstract class PatientChecker extends UserLoader {

  patientReadPermission: boolean;
  practitionerReadPermission: boolean;

  routerPermissions: Array<any>;

  constructor(loginService: LoginService, router: Router) {
    super(loginService, router);

    this.loginService.getMeSubject().subscribe(me => {
      if (me != null && !this.loginService.isPatient()) {
        this.practitionerReadPermission = this.loginService.hasPermission('IDENTIFICATION_PRACTITIONER', 'READ');
        this.patientReadPermission = this.loginService.hasPermission('IDENTIFICATION_PATIENT', 'READ');

        this.routerPermissions = [];
        this.routerPermissions.push({permission: this.practitionerReadPermission, route: '/app/practitioner'});
        this.routerPermissions.push({permission: this.patientReadPermission, route: '/app/patient'});
      }
    });
  }

  protected handleAccess() {
    const currentUrl = this.router.routerState.snapshot.url;
    if ('patient' === this.type) {
      if (currentUrl !== '/evaluation') {
        console.log('Patient login detected, redirecting to evaluation page');
        this.router.navigate(['/evaluation']);
      }
    }else if (currentUrl === '/evaluation') {
      this.redirectToAvailableRoute();
    } else if (!this.practitionerReadPermission && currentUrl === '/app/practitioner') {
      this.redirectToAvailableRoute();
    } else if (!this.patientReadPermission && currentUrl === '/app/patient') {
      this.redirectToAvailableRoute();
    }
  }

  redirectToAvailableRoute() {
    let redirected = false;
    for (let index = 0; index < this.routerPermissions.length; index++) {
      const element = this.routerPermissions[index];
      if (element.permission) {
        this.router.navigate([element.route]);
        redirected = true;
        break;
      }
    }
    if (!redirected) {
      this.router.navigate(['/app/forbidden']);
    }
  }
}
