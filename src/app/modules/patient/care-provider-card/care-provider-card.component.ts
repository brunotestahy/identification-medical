import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Patient,
  Practitioner,
  PatientService,
  Appointment,
  AppointmentService,
  ROLES,
  SHIFTS
} from 'front-end-common';

import * as momentLib from 'moment';
import { MatDatepicker, MatDatepickerInput } from '@angular/material';

import { Observable } from 'rxjs/Rx';

const moment = (momentLib as any).default
  ? (momentLib as any).default
  : momentLib;

const ASSISTANT = 'assistant';
const ASSOCIATED = 'associated';

const MOMENT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const MOMENT_AVAL_DATE_FORMAT = 'YYYY-MM-DDTHH:mmZ';

@Component({
  templateUrl: './care-provider-card.component.html',
  selector: 'app-care-provider-card',
  styleUrls: ['./care-provider-card.component.css']
})
export class CareProviderCardComponent implements OnInit, OnChanges {
  private _patient: Patient;
  private _appointments: Array<Appointment>;

  @Output() hasChanges: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  loading: boolean;
  success: boolean;
  error: boolean;

  shiftAppointmentMap: Map<number, Appointment>;

  availableDates: Array<String>;

  availableShifts: Array<number>;

  appointmentsBackup: Map<number, Appointment>;

  thisMoment: string;

  inputDatePicker: MatDatepickerInput<Date>;

  datePicker: MatDatepicker<Date>;

  get appointments() {
    return this._appointments;
  }

  @Input()
  set appointments(value: any) {
    this._appointments = value as Array<Appointment>;
    this.appointmentsBackup = null;
    this.loadShiftAppointments(this._appointments);
    this.thisMoment = moment(this.selectedDate)
      .hour(0)
      .minute(0)
      .format(MOMENT_AVAL_DATE_FORMAT);
    if (this.inputDatePicker != null) {
      this.inputDatePicker.value = null;
    }
    if (this.datePicker != null) {
      this.datePicker._select(null);
    }
  }

  @Input() selectedDate: Date;

  @Input() editable: boolean;

  @Input() cardIsLoading: boolean;

  @Input()
  set patient(value: any) {
    this._patient = value as Patient;
  }

  get patient() {
    return this._patient;
  }

  currentYear: number;
  currentMonth: number;

  constructor(
    private pService: PatientService,
    private aService: AppointmentService
  ) {}

  ngOnInit() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.loading = false;
    this.success = false;
    this.error = false;
    this.availableDates = [];
    this.availableShifts = Object.keys(SHIFTS).map(
      shiftKey => SHIFTS[shiftKey]
    );
  }

  ngOnChanges() {}

  getBirthdate(): Date {
    const birthDate = this.patient.birthDate;
    if (birthDate != null && birthDate.dateTime != null) {
      return new Date(birthDate.dateTime);
    }
    return null;
  }

  getAge(): number {
    const birthDate = this.patient.birthDate;
    if (birthDate != null && birthDate.dateTime != null) {
      const patientDate = new Date(birthDate.dateTime);
      const patientYear = patientDate.getFullYear();
      const patientMonth = patientDate.getMonth();
      let age = this.currentYear - patientYear;
      if (patientMonth > this.currentMonth) {
        age--;
      }
      return age;
    }
    return null;
  }

  getPractitioner(key: string): Practitioner {
    if (this._patient.careProviders != null) {
      return this._patient.careProviders[key];
    }
    return null;
  }

  getAssistantMedic(): Practitioner {
    return this.getPractitioner(ASSISTANT);
  }

  getAssociatedMedic(): Practitioner {
    return this.getPractitioner(ASSOCIATED);
  }

  updateCardZindex(content) {
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
      (cards[i] as HTMLDivElement).style.zIndex = null;
    }
    content.parentNode.style.zIndex = 2;
  }

  setAssistant(prac: Practitioner) {
    this.setPractitioner(prac, ASSISTANT);
  }

  setAssociated(prac: Practitioner) {
    this.setPractitioner(prac, ASSOCIATED);
  }

  setPractitioner(prac: Practitioner, key: string) {
    this.loading = true;
    this.pService.addCareProvider(this._patient.id, prac.id, key).subscribe(
      () => {
        if (this._patient.careProviders == null) {
          this._patient.careProviders = new Map<string, Practitioner>();
        }
        if (this._patient.careProviderIds == null) {
          this._patient.careProviderIds = new Map<string, string>();
        }
        this._patient.careProviders[key] = prac;
        this._patient.careProviderIds[key] = prac.id;
        this.loading = false;
        this.success = true;
      },
      () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 4000);
      }
    );
  }

  onRemoveAssitant(prac: Practitioner) {
    this.onRemovePractitioner(prac, ASSISTANT);
  }

  onRemoveAssociated(prac: Practitioner) {
    this.onRemovePractitioner(prac, ASSOCIATED);
  }

  onRemovePractitioner(prac: Practitioner, key: string) {
    this.loading = true;
    this.pService.removeCareProvider(this._patient.id, prac.id, key).subscribe(
      () => {
        this.loading = false;
        delete this._patient.careProviderIds[key];
        delete this._patient.careProviders[key];
      },
      () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 4000);
      }
    );
  }

  getShiftPractitioner(shift: string, role: string) {
    const appointment: Appointment = this.shiftAppointmentMap[shift];
    if (appointment != null) {
      return appointment.practitioners.find(
        prac => prac.practitionerRoles.indexOf(role) !== -1
      );
    }
    return null;
  }

  setShiftPractitioner(practitioner: Practitioner, shift: number) {
    this.loading = true;
    let appointment: Appointment = this.shiftAppointmentMap[shift];
    if (appointment == null) {
      const momen: momentLib.Moment = moment(this.selectedDate);
      let start: string = null;
      let end: string = null;

      if (SHIFTS.DAY === shift) {
        start = momen
          .hour(7)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
        end = momen
          .hour(12)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
      } else if (SHIFTS.AFTERNOON === shift) {
        start = momen
          .hour(13)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
        end = momen
          .hour(19)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
      } else {
        start = momen
          .hour(19)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
        end = momen
          .add(1, 'days')
          .hour(6)
          .minute(0)
          .second(0)
          .format(MOMENT_FORMAT);
      }

      appointment = {
        context: 'identification',
        patientId: this.patient.id,
        period: {
          startDate: {
            dateTime: start
          },
          endDate: {
            dateTime: end
          }
        },
        status: 'proposed',
        practitionerIds: [practitioner.id],
        practitioners: [practitioner]
      };
      this.aService.saveShifts([appointment]).subscribe(
        (response: Array<Appointment>) => {
          const savedAppointment = response[0];
          this.loading = false;
          this._appointments.push(savedAppointment);
          this.shiftAppointmentMap[shift] = savedAppointment;
        },
        () => {
          this.loading = false;
          this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 4000);
        }
      );
    } else {
      const appointmentCopy = { ...appointment };
      if (appointmentCopy.practitioners.length === 2) {
        appointmentCopy.practitioners.forEach((prac, index) => {
          const currentPracRoles = prac.practitionerRoles;
          const selectedPracRoles = practitioner.practitionerRoles;
          if (
            currentPracRoles.length !== 0 &&
            selectedPracRoles.length !== 0 &&
            currentPracRoles[0] === selectedPracRoles[0]
          ) {
            appointmentCopy.practitioners[index] = practitioner;
            appointmentCopy.practitionerIds[index] = practitioner.id;
          }
        });
      } else {
        appointmentCopy.practitionerIds.push(practitioner.id);
        appointmentCopy.practitioners.push(practitioner);
      }
      this.aService.saveShifts([appointmentCopy]).subscribe(
        (response: Array<Appointment>) => {
          const savedAppointment = response[0];
          this.loading = false;
          this.shiftAppointmentMap[shift] = savedAppointment;
          this._appointments[
            this._appointments.indexOf(appointment)
          ] = savedAppointment;
        },
        () => {
          this.loading = false;
          this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 4000);
        }
      );
    }
  }

  onRemoveShiftPractitioner(practitioner: Practitioner, shift: string) {
    this.loading = true;
    const appointment = this.shiftAppointmentMap[shift];
    const appointmentCopy = { ...appointment };
    const index = appointmentCopy.practitioners.indexOf(practitioner);
    appointmentCopy.practitioners.splice(index, 1);
    appointmentCopy.practitionerIds.splice(index, 1);

    if (appointmentCopy.practitioners.length === 0) {
      this.aService.remove(appointmentCopy).subscribe(
        () => {
          this.loading = false;
          delete this.shiftAppointmentMap[shift];
          this._appointments.splice(this._appointments.indexOf(appointment), 1);
        },
        () => {
          this.loading = false;
          this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 4000);
        }
      );
    } else {
      this.aService.saveShifts([appointmentCopy]).subscribe(
        (response: Array<Appointment>) => {
          const savedAppointment = response[0];
          this.loading = false;
          this.shiftAppointmentMap[shift] = savedAppointment;
          this._appointments[
            this._appointments.indexOf(appointment)
          ] = savedAppointment;
        },
        () => {
          this.loading = false;
          this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 4000);
        }
      );
    }
  }

  getRoleCode(role: string): string {
    return ROLES[role];
  }

  openedDatePicker(
    inputDate: MatDatepickerInput<Date>,
    datePicker: MatDatepicker<Date>
  ) {
    this.inputDatePicker = inputDate;
    this.datePicker = datePicker;
    this.loading = true;
    this.aService.getAvailableDates(this.patient.id).subscribe(
      (response: Array<string>) => {
        this.availableDates = response.map(dateStr =>
          dateStr
            .substr(0, dateStr.indexOf('['))
            .replace(/T[0-9]{2}\:[0-9]{2}/g, 'T00:00')
        );
        this.loading = false;
        datePicker.open();
      },
      () => {
        this.loading = false;
        this.error = true;
        // setTimeout(() => {
        //   this.error = false;
        // }, 4000);
      }
    );
  }

  filterDates = (d: Date): boolean => {
    const givenFormatted = moment(d).format(MOMENT_AVAL_DATE_FORMAT);
    if (this.availableDates != null && givenFormatted !== this.thisMoment) {
      return this.availableDates.indexOf(givenFormatted) !== -1;
    }
    return false;
  }

  getAppointmentsToCopy(d: Date) {
    if (d != null) {
      this.loading = true;
      this.aService.getShifts(d, false, [this.patient]).subscribe(
        response => {
          if (this.appointmentsBackup == null) {
            this.appointmentsBackup = this.shiftAppointmentMap;
          }
          this.loadShiftAppointments(response['dtoList']);
          this.loading = false;
        },
        () => {
          this.loading = false;
          this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 4000);
        }
      );
    }
  }

  saveCopy(inputDate: MatDatepickerInput<Date>, datePicker: MatDatepicker<Date>) {
    this.inputDatePicker = inputDate;
    this.datePicker = datePicker;
    inputDate.value = null;
    datePicker._select(null);
    this.loading = true;
    const appointmentsToRemove = new Array<Appointment>();
    const appointmentsToSave = new Array<Appointment>();
    Object.keys(SHIFTS).forEach(shift => {
      const shiftCode = SHIFTS[shift];
      const current: Appointment = this.shiftAppointmentMap[shiftCode];
      const bkp: Appointment = this.appointmentsBackup[shiftCode];
      if (current == null && bkp == null) {
        return;
      }
      if (current == null && bkp != null) {
        appointmentsToRemove.push(bkp);
      } else if (current != null && bkp == null) {
        const appointmentToCreate: Appointment = {
          context: 'identification',
          patientId: this.patient.id,
          period: {
            startDate: {
              dateTime: this.copyDateTime(current.period.startDate.dateTime)
            },
            endDate: {
              dateTime: this.copyDateTime(current.period.endDate.dateTime)
            }
          },
          status: 'proposed',
          practitionerIds: current.practitionerIds,
          practitioners: current.practitioners
        };
        appointmentsToSave.push(appointmentToCreate);
      } else {
        // both are not null
        bkp.practitionerIds = current.practitionerIds;
        bkp.practitioners = current.practitioners;
        appointmentsToSave.push(bkp);
      }
    });
    Observable.zip(
      this.aService.deleteAll(appointmentsToRemove),
      this.aService.saveShifts(appointmentsToSave)
    ).subscribe(
      ([responseRemove, responseSave]) => {
        this.loading = false;
        this.loadShiftAppointments(responseSave);
        this._appointments.splice(0, this._appointments.length);
        this._appointments.push(...responseSave);
        this.appointmentsBackup = null;
      },
      () => {
        this.loading = false;
        this.error = true;
        // setTimeout(() => {
        //   this.error = false;
        // }, 4000);
      }
    );
  }

  private copyDateTime(dateTime: string) {
    const given: momentLib.Moment = moment(dateTime, MOMENT_FORMAT);
    const calMoment: momentLib.Moment = moment(this.selectedDate);
    return given
      .date(calMoment.date())
      .month(calMoment.month())
      .year(calMoment.year())
      .format(MOMENT_FORMAT);
  }

  cancelCopy(inputDate: MatDatepickerInput<Date>, datePicker: MatDatepicker<Date>) {
    this.inputDatePicker = inputDate;
    this.datePicker = datePicker;
    this.shiftAppointmentMap = this.appointmentsBackup;
    this.appointmentsBackup = null;
    inputDate.value = null;
    datePicker._select(null);
  }

  private loadShiftAppointments(appointments: Array<Appointment>) {
    this.shiftAppointmentMap = new Map<number, Appointment>();
    if (appointments) {
      appointments.forEach(appointment => {
        this.shiftAppointmentMap[
          this.aService.getShiftByAppointment(appointment)
        ] = appointment;
      });
    }
  }
}
