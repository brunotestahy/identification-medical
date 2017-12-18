import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Practitioner, PractitionerService, LoginService } from 'front-end-common';
import { PatientChecker } from '../patient-checker';
import { environment, Environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { PractitionerRoleService } from '../practitioner/practitioner-role.service';
import { UserSessionService } from '../shared/user-session.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PractitionerService]
})
export class DashboardComponent implements OnInit {

  patient: any;
  searchDebouncer = new Subject<string>();
  loadingMore: boolean;
  loading: boolean;
  error: boolean;
  errorDelete: boolean;
  practitioners: Array<Practitioner> = [];
  urlNext: string;
  roleMap: Map<string, string>;
  lastInputFilter: string;
  selectedRole: string;
  private typeTimeout = 1000;
  suggestions: Array<string>;
  depositions: string;
  currentRate: number;
  currentRateDepositions: number;
  selectedOrder;
  sectors;

  constructor(private pService: PractitionerService,
    private loginService: LoginService,
    private translate: TranslateService,
    private practitionerRoleService: PractitionerRoleService,
    private userSessionService: UserSessionService,
    private ratingConfig: NgbRatingConfig) {

      this.ratingConfig.max = 5;



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
    }


  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.depositions = 'Lorem ipsum torquent sollicitudin sodales curabitur etiam euismod faucibus, feugiat netus viverra nunc vestibulum dui class, imperdiet ornare urna metus ut placerat venenatis. dictum nisl ut venenatis leo etiam himenaeos phasellus sit, eu elementum malesuada elementum nunc mattis litora nam, etiam velit accumsan enim scelerisque vehicula quisque. neque etiam mollis morbi nec nisl quam sit per rhoncus aliquet';
    this.currentRate = 3.6;
    this.currentRateDepositions = 4;
    this.loading = true;
    this.error = false;
    this.errorDelete = false;
    this.urlNext = null;
    this.lastInputFilter = '';
    this.searchDebouncer.next(this.lastInputFilter);
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

}
