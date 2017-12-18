import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Practitioner, Rating, Patient, RatingService, RatingReason, RegionalCouncilService } from 'front-end-common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import * as momentLib from 'moment';
import { Moment } from 'moment';

const moment = (momentLib as any).default
  ? (momentLib as any).default
  : momentLib;

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.css']
})
export class EvaluationFormComponent implements OnInit {

  private _practitioner: Practitioner;

  reasons: Array<RatingReason>;

  private _patient: Patient;

  @Input()
  set practitioner(value: any) {
    this._practitioner = value as Practitioner;
  }

  get practitioner() {
    return this._practitioner;
  }

  @Input()
  set patient(value: any){
    this._patient = value as Patient;
  }

  get patient(){
    return this._patient;
  }

  @Input() opened: boolean;
  @Input() rolemap: Map<string, string>;
  @Input() stars: number;
  @Output() overlayClick = new EventEmitter<void>();
  @Output() successSubmition = new EventEmitter<boolean>();
  @Input() pastRating: boolean;

  messageTextArea: string;
  goodCommentTextAreaOpen: boolean;
  ratingForm: FormGroup;
  role: string;
  rating: Rating;
  firstName: string;
  currentRate;
  reasonFormArray;
  constructor(config: NgbRatingConfig,
              private fb: FormBuilder,
              private ratingService: RatingService,
              private regionalCouncilService: RegionalCouncilService) {
    config.max = 5;
  }

  ngOnInit() {
    this.goodCommentTextAreaOpen = false;
    this.ratingForm = this.fb.group({
      'rating':  ['', [Validators.required, Validators.minLength(1)]],
      'comment' : [''],
      'reasonsCombo' : this.fb.array([])
    });
    this.rolemapImplementation();
    this.reasonFormArray = <FormArray>this.ratingForm.controls.reasonsCombo;
    this.ratingService.getReasons().subscribe(
      (success) => {
        this.reasons = success;
      },
      (error) => {
        console.log(error);
      });
      console.log(this.pastRating);
      this.firstName = this.capitalizeFirstLetter(this.patient.givenName[0]);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  rolemapImplementation() {
    this.role = this.rolemap[this.practitioner.practitionerRoles];
  }

  onSubmit(ratingForm: FormGroup) {
    // forms value
    console.log(ratingForm);
    this.rating = {
      rating: ratingForm.value.rating,
      comment: ratingForm.controls.comment.value,
      hisAdtId: this.patient.hisAdtId,
      patientId: this.patient.id,
      practitionerId: this.practitioner.id,
      reasons: ratingForm.value.reasonsCombo,
      date: {dateTime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ')}
    };

    console.log(this.rating);

    this.ratingService.save(this.rating)
      .subscribe( (success) => {
        console.log(success);
        this.successSubmition.emit(true);
        this.onOverlayClick();
      }, (error) => {
        console.log(error);
      });
  }

  onOverlayClick() {
    this.overlayClick.emit();
  }

  doTextareaValueChange(ev) {
    try {
      this.messageTextArea = ev.target.value;
      this.ratingForm.controls.comment = new FormControl(this.messageTextArea);
    } catch (e) {
      console.log('could not set textarea-value');
    }
  }

  goodComment() {
    this.goodCommentTextAreaOpen = true;
  }

  getRegionalCouncil(practitioner: Practitioner) {
    return this.regionalCouncilService.getRegionalCouncil(practitioner);
  }

  onChangeCombo( reason: string, isChecked: boolean) {
    if ( isChecked ) {
      this.reasonFormArray.push(new FormControl(reason));
    } else {
      const index = this.reasonFormArray.controls.findIndex(x => x.value === reason);
      this.reasonFormArray.removeAt(index);
    }
    console.log(this.reasonFormArray);
  }
}
