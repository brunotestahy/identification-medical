import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Practitioner, PractitionerService, LoginService, AppointmentService, RatingService, Patient, Rating  } from 'front-end-common';
import { PatientChecker } from '../patient-checker';
import { environment, Environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { PractitionerRoleService } from '../practitioner/practitioner-role.service';
import { UserSessionService } from '../shared/user-session.service';

declare const startApp: any;

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent extends PatientChecker implements OnInit {
  patient: any;
  searchDebouncer = new Subject<string>();
  loading: boolean;
  loadingMore: boolean;
  loadingDelete: boolean;
  error: boolean;
  errorDelete: boolean;
  practitioners: Array<Practitioner> = [];
  urlNext: string;
  roleMap: Map<string, string>;
  lastInputFilter: string;
  selectedRatedFilter: string;
  evaluationFormOpened: boolean;
  pracForm: Practitioner;
  roleMapForm: Map<string, string>;
  ratings: Array<Rating>;
  haveBeenRated: Map<string, boolean>;
  private typeTimeout = 1000;

  filteredPractitioners: Array<Practitioner>;

  constructor(private pService: PractitionerService,
              protected loginService: LoginService,
              private translate: TranslateService,
              private practitionerRoleService: PractitionerRoleService,
              private userSessionService: UserSessionService,
              private appointmentService: AppointmentService,
              private ratingService: RatingService,
              protected router: Router) {

    super(loginService, router);

    this.loginService.getMeSubject().subscribe(me => {
      if (me != null && this.loginService.isPatient()) {
        console.log(me);
        this.patient = me.dto;
      }
    });

    this.searchDebouncer
    .debounceTime(this.typeTimeout)
    .switchMap(term => this.search(term))
    .subscribe(
      response => {
        this.practitioners = response instanceof Array ? response : null;
        // console.log(this.practitioners);
        this.ratingService.search(this.patient.hisAdtId, null, null, null, null, null, null, true)
        .subscribe( (rating) => {
          this.ratings = rating;
          this.checkPractitionersRated();
          this.filteredPractitioners = this.filterResponse(this.practitioners);
          this.loading = false;
        });
      },
      () => {
        this.loading = false;
        this.error = true;
      }
    );

    this.practitionerRoleService.getRoleMapSubject().subscribe(roleMap => {
      this.roleMap = roleMap;
      // console.log(this.roleMap);
    });
  }

  filterResponse(practitioners: Array<Practitioner>): Array<Practitioner> {
    if (practitioners == null) {
      return null;
    }
    const words = this.lastInputFilter.toLowerCase().split(' ');
    const inputFiltered =  practitioners.filter(practitioner => {
      const found = words.find(word => {
        return practitioner.fullName.toLowerCase().indexOf(word) !== -1;
      });
      return found != null;
    });
    return this.filterBySelect(inputFiltered);
  }

  filterBySelect(practitioners: Array<Practitioner>): Array<Practitioner> {
    if (practitioners == null) {
      return null;
    }
    return practitioners.filter(practitioner => {
      if (this.selectedRatedFilter == null) {
        return true;
      } else if (this.haveBeenRated != null && this.haveBeenRated[practitioner.id] != null) {
        const rated = this.haveBeenRated[practitioner.id];
        return this.selectedRatedFilter === 'evaluated' ? rated : !rated;
      }
    }).sort((p1: Practitioner, p2: Practitioner) => {
      if (p1.fullName > p2.fullName) {
        return 1;
      }
      if (p1.fullName < p2.fullName) {
        return -1;
      }
      return 0;
    });
  }

  onRatedFilterSelect() {
    this.filteredPractitioners = this.filterResponse(this.practitioners);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loading = true;
    this.loadingDelete = false;
    this.error = false;
    this.errorDelete = false;
    this.urlNext = null;
    this.lastInputFilter = '';
    this.evaluationFormOpened = false;
    this.searchDebouncer.next(this.lastInputFilter);
  }

  checkPractitionersRated() {

    this.haveBeenRated = new Map<string, boolean>();
    if (this.practitioners !== null) {
      for (let i = 0; i < this.practitioners.length; i++) {
        this.haveBeenRated[this.practitioners[i].id] = false;
        for (let k = 0; k < this.ratings.length; k++) {
          if (this.practitioners[i].id === this.ratings[k].practitioner.id) {
            // tslint:disable-next-line:max-line-length
            this.haveBeenRated[this.practitioners[i].id] = true;
            break;
          }
        }
      }
      // console.log(this.haveBeenRated);
    }

  }

  debouncedSearch(filter: string) {
    this.searchDebouncer.next(filter);
  }

  search(filter: string) {
    this.lastInputFilter = filter;
    this.loading = true;
    this.error = false;
    this.urlNext = null;
    return this.appointmentService.getPractitioners(this.patient.id, new Date());
  }

  openEvaluationForm(prac, rolemap) {
    this.evaluationFormOpened = true;
    this.pracForm = prac;
    this.roleMapForm = rolemap;
  }

  onOverlayClick() {
    this.evaluationFormOpened = false;
  }

  isSelected(prac: Practitioner) {
    return this.haveBeenRated[prac.id];
  }

  isHidden() {
    return this.type == null || this.type === 'employee';
  }

  onSuccessSubmition() {
    this.searchDebouncer.next(this.lastInputFilter);
  }

  openApp(appPath: string) {
    startApp.set(appPath).start(
      function(){},
      function(error) {
        console.error(error);
      }
    );
  }

  openSmartApp() {
    return this.openApp(environment.smartAppPath);
  }

  openCarePlanApp() {
    return this.openApp(environment.carePlanAppPath);
  }

  openScheduleApp() {
    return this.openApp(environment.scheduleAppPath);
  }

  refresh() {
    this.loading = true;
    this.debouncedSearch(this.lastInputFilter);
  }
}
