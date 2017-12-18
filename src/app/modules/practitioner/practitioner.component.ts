import { PractitionerRoleService } from './practitioner-role.service';
import { Component, OnInit } from '@angular/core';
import { Practitioner, PractitionerService, LoginService } from 'front-end-common';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { UserSessionService } from '../shared/user-session.service';

@Component({
  selector: 'app-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class PractitionerComponent implements OnInit {
  practitioners: Array<Practitioner> = [];
  urlNext: string;
  photoDialogOpened: boolean;
  deletePhotoDialogOpened: boolean;
  selectedPractitioner: Practitioner;
  loading: boolean;
  loadingMore: boolean;
  loadingDelete: boolean;
  error: boolean;
  errorDelete: boolean;
  photoEditEnable: boolean;

  searchDebouncer = new Subject<string>();

  private typeTimeout = 1000;

  selectedRole: string;

  roleMap: Map<string, string>;

  lastInputFilter: string;

  constructor(private pService: PractitionerService,
    private loginService: LoginService,
    private translate: TranslateService,
    private practitionerRoleService: PractitionerRoleService,
    private userSessionService: UserSessionService) {

    this.photoEditEnable = false;

    this.loginService.getMeSubject().subscribe(me => {
      if (me != null && !this.loginService.isPatient()) {
        this.photoEditEnable = this.loginService.hasPermission('IDENTIFICATION_PRACTITIONER', 'WRITE');
      }
    });

    this.searchDebouncer
      .debounceTime(this.typeTimeout)
      .switchMap(term => this.search(term))
      .subscribe(
      response => {
        this.practitioners = response['dtoList'];
        this.urlNext = response['urlNext'];
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.error = true;
      }
      );

    this.practitionerRoleService.getRoleMapSubject().subscribe(roleMap => {
      this.roleMap = roleMap;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.loadingDelete = false;
    this.error = false;
    this.errorDelete = false;
    this.urlNext = null;
    this.lastInputFilter = '';
    this.searchDebouncer.next(this.lastInputFilter);
    this.selectedRole = this.userSessionService.selectedRole;
  }

  debouncedSearch(filter: string) {
    this.searchDebouncer.next(filter);
  }

  search(filter: string) {
    this.lastInputFilter = filter;
    this.loading = true;
    this.error = false;
    this.urlNext = null;
    return this.pService.searchPractitioners(
      filter.replace(/\s/g, ','),
      environment.his,
      true,
      this.selectedRole,
      20
    );
  }

  getMorePractitioners() {
    this.loadingMore = true;
    this.error = false;
    this.pService.getMorePractitioners(this.urlNext).subscribe(
      response => {
        this.practitioners = this.practitioners.concat(response['dtoList']);
        this.urlNext = response['urlNext'];
        this.loadingMore = false;
      },
      () => {
        this.loadingMore = false;
        this.error = true;
      }
    );
  }

  openPractitionerPhotoDialog(practitioner: Practitioner) {
    this.selectedPractitioner = practitioner;
    this.photoDialogOpened = true;
  }

  onOverlayClick() {
    this.photoDialogOpened = false;
  }

  onPractitionerSaved(practitionerSaved: Practitioner) {
    const index = this.practitioners.indexOf(this.selectedPractitioner);
    this.practitioners[index] = practitionerSaved;
    this.selectedPractitioner = practitionerSaved;
    this.photoDialogOpened = false;
  }

  openDeleteDialog(practitioner: Practitioner) {
    this.selectedPractitioner = practitioner;
    this.deletePhotoDialogOpened = true;
  }

  closeDeleteDialog() {
    this.deletePhotoDialogOpened = false;
    this.loadingDelete = false;
    this.errorDelete = false;
  }

  deletePractitionerPhoto() {
    this.loadingDelete = true;
    const practitionerToSave: Practitioner = {
      ...this.selectedPractitioner,
      photo: null
    };
    this.pService.save(practitionerToSave).subscribe(
      (practitionerSaved: Practitioner) => {
        const index = this.practitioners.indexOf(this.selectedPractitioner);
        this.practitioners[index] = practitionerSaved;
        this.deletePhotoDialogOpened = false;
        this.loadingDelete = false;
      },
      () => {
        this.loadingDelete = false;
        this.errorDelete = true;
      }
    );
  }

  getRoleKeys() {
    return Object.keys(this.roleMap);
  }

  onRoleSelect() {
    this.userSessionService.selectedRole = this.selectedRole;
    this.searchDebouncer.next(this.lastInputFilter);
  }
}
