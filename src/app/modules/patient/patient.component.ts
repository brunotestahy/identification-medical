import { Component, OnInit } from '@angular/core';
import {
  Patient,
  RoomService,
  ConceptmapService,
  LoginService,
  AppointmentService,
  Appointment
} from 'front-end-common';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs/Rx';
import { UserSessionService } from '../shared/user-session.service';
import { PatientCachedService } from './patient-cached.service';
import * as momentLib from 'moment';

const moment = (momentLib as any).default
? (momentLib as any).default
: momentLib;

const ROOM_PREFIX = 'SUITE';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  patients: Array<Patient> = [];
  filteredPatients: Array<Patient> = [];
  urlNext: string;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  hasPermissionToEdit: boolean;
  roomMapping: Object;
  allRooms: Array<any>;
  allSectors: Array<any>;

  roomsBySector: Object;
  sectors: Array<any>;

  selectedOrder: string;
  selectedSector: string;
  showSaveChangesButton: boolean;
  inputDebouncer = new Subject<string>();
  dateSwitchMap = new Subject<Date>();

  selectedDate: Date;

  appointmentMap = new Map<string, Array<Appointment>>();

  ORDER_NAME = 'fullName';
  ROOM = 'room';

  loadingAppointment: boolean;

  private typeTimeout = 1000;

  lastInputFilter: string;

  constructor(
    private pService: PatientCachedService,
    private cmService: ConceptmapService,
    private rService: RoomService,
    private loginService: LoginService,
    private userSessionService: UserSessionService,
    private appointmentService: AppointmentService
  ) {

    this.dateSwitchMap
      .switchMap(date => {
        this.loadingAppointment = true;
        return this.changeDate(date);
      })
      .subscribe(
        resp => {
          const appointments: Array<Appointment> = resp['dtoList'];
          this.patients.forEach(patient => {
            this.appointmentMap[patient.id] = new Array<Appointment>();
          });
          appointments.forEach(appointment => {
            const patientId = appointment.patientId;
            if (this.appointmentMap[patientId] != null) {
              this.appointmentMap[patientId].push(appointment);
            }
          });
          this.loadingAppointment = false;
        },
        () => {
          this.loading = false;
          this.error = true;
        }
      );
    this.inputDebouncer
      .debounceTime(this.typeTimeout)
      .switchMap(term => this.search(term))
      .subscribe(
        response => {
          this.patients = response['dtoList'];
          this.urlNext = response['urlNext'];
          this.loading = false;
          this.filterBySector();
          this.dateSwitchMap.next(this.selectedDate);
        },
        () => {
          this.loading = false;
          this.error = true;
        }
      );

    this.hasPermissionToEdit = false;
    this.loginService.getMeSubject().subscribe(me => {
      if (me != null && !this.loginService.isPatient()) {
        this.loadPermissions();
      }
    });
  }

  ngOnInit() {
    this.showSaveChangesButton = false;
    this.selectedDate = new Date();
    this.selectedOrder = this.userSessionService.selectedOrder;
    this.selectedSector = this.userSessionService.selectedSector;
    if (this.selectedOrder == null) {
      this.selectedOrder = this.ORDER_NAME;
      this.userSessionService.selectedOrder = this.ORDER_NAME;
    }
    this.loading = true;
    this.error = false;
    this.lastInputFilter = '';
    this.inputDebouncer.next(this.lastInputFilter);

    Observable.zip(
      this.cmService.get(environment.roomMapping),
      this.rService.get(),
      this.rService.getSectors()
    ).subscribe(([roomMappingRes, allRoomsRes, allSectorsRes]) => {
      this.roomMapping = roomMappingRes.map;
      this.allRooms = allRoomsRes.values;
      // Apenas de 1 a 4 andar Ala A
      this.allSectors = allSectorsRes.values.filter(
        value =>
          value.display.match(/([1-4]{1}o.*Ala A)|([1-3]{1}o.*Ala B)/g) != null
      );

      this.buildRoomsBySector();
      this.buildSectorsArray();
    });
  }

  isEditable() {
    return this.hasPermissionToEdit && moment(new Date()).dayOfYear() <= moment(this.selectedDate).dayOfYear();
  }

  loadPermissions() {
    this.hasPermissionToEdit = this.loginService.hasPermission(
      'IDENTIFICATION_PATIENT',
      'WRITE'
    );
  }

  debouncedSearch(filter: string) {
    this.loading = true;
    this.inputDebouncer.next(filter);
  }

  search(filter: string) {
    this.lastInputFilter = filter;
    this.loading = true;
    this.error = false;
    this.urlNext = null;
    let nameFilter = null;
    let roomFilter = null;
    const nameMatch = filter.match(/[a-zA-Z]+/g);
    const roomMatch = filter.match(/[0-9]+/g);
    if (nameMatch != null) {
      nameFilter = nameMatch.join(',');
    }
    if (roomMatch != null) {
      roomFilter = ROOM_PREFIX + ' ' + roomMatch.join(`,${ROOM_PREFIX}`);
    }

    return this.pService.searchCached(nameFilter, roomFilter, true);
    // return this.pService.search(nameFilter, roomFilter, true, true);
  }

  getMorePatients() {
    this.loadingMore = true;
    this.error = false;
    this.pService.getMorePatients(this.urlNext).subscribe(
      response => {
        this.patients = this.patients.concat(response['dtoList']);
        this.urlNext = response['urlNext'];
        this.loadingMore = false;
      },
      () => {
        this.loadingMore = false;
        this.error = true;
      }
    );
  }

  buildRoomsBySector() {
    this.roomsBySector = new Object();
    if (this.roomMapping == null) {
      return;
    }
    Object.keys(this.roomMapping).map(room => {
      const sector = this.roomMapping[room];
      let rooms: Array<string> = this.roomsBySector[sector];

      if (!rooms) {
        rooms = new Array<string>();
      }
      rooms.push(this.getRoomNumberByCode(room));
      this.roomsBySector[sector] = rooms;
    });
  }

  buildSectorsArray() {
    this.sectors = new Array<any>();
    this.allSectors.map(sector => {
      this.sectors.push({ value: sector['code'], display: sector['display'] });
    });
  }

  getRoomNumberByCode(code: string): any {
    let result: string;
    let i = 0;
    while (!result && i < this.allRooms.length) {
      const room = this.allRooms[i];
      if (room['code'] === code) {
        result = room['display'].toUpperCase();
      }
      i++;
    }
    return result;
  }

  filterBySector() {
    this.userSessionService.selectedSector = this.selectedSector;
    let roomsInSector: Array<string>;
    if (this.selectedSector) {
      roomsInSector = this.roomsBySector[this.selectedSector];
    } else {
      roomsInSector = [];
      this.allSectors.forEach(sector => {
        this.roomsBySector[sector.code].forEach(room => {
          roomsInSector.push(room);
        });
      });
    }
    this.filteredPatients = this.patients.filter(
      patient => roomsInSector.indexOf(patient.room) > -1
    );
    this.orderBy();
  }

  orderBy() {
    this.userSessionService.selectedOrder = this.selectedOrder;
    if (this.selectedOrder === this.ROOM) {
      const strs: Array<Patient> = [];
      const nums: Array<Patient> = [];
      this.filteredPatients.map(patient => {
        const room = Number(patient[this.selectedOrder]);
        if (isNaN(room)) {
          strs.push(patient);
        } else {
          nums.push(patient);
        }
      });

      strs.sort((a, b) => {
        return this.compare(a[this.selectedOrder], b[this.selectedOrder]);
      });

      nums.sort((a, b) => {
        const numA = Number(a[this.selectedOrder]);
        const numB = Number(b[this.selectedOrder]);
        return this.compare(numA, numB);
      });

      this.filteredPatients = nums.concat(strs);
    } else {
      this.filteredPatients.sort((a, b) => {
        return this.compare(a[this.selectedOrder], b[this.selectedOrder]);
      });
    }
  }

  compare(a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }

  getAppointments(patient: Patient): Array<Appointment> {
    return this.appointmentMap[patient.id];
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    this.dateSwitchMap.next(date);
  }

  changeDate(date: Date) {
    return this.appointmentService.getShifts(this.selectedDate, false, this.patients);
  }

  somethingChanged(event) {
    this.showSaveChangesButton = event;
  }
}
