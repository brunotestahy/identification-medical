import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Practitioner, PractitionerService } from 'front-end-common';

@Component({
  selector: 'app-practitioner-photo-dialog',
  templateUrl: './practitioner-photo-dialog.component.html',
  styleUrls: ['./practitioner-photo-dialog.component.css']
})
export class PractitionerPhotoDialogComponent implements OnInit {

  @Input() opened: boolean;

  @Input() title: string;
  @Input() successMessage: string;
  @Input() errorMessage: string;
  @Input() thumbnailPlaceHolder: string;
  @Input() cancelLabel: string;
  @Input() saveLabel: string;

  @Output() overlayClick = new EventEmitter<void>();
  @Output() practitionerSaved = new EventEmitter<Practitioner>();

  loading: boolean;
  success: boolean;
  error: boolean;

  practitionerPhoto: Practitioner;

  private _practitioner: Practitioner;

  @Input() set practitioner(value: any) {
    this._practitioner = value == null ? null : value as Practitioner;
    this.resetPractitioner();
  }

  get practitioner() {
    return this._practitioner;
  }

  constructor(private practitionerService: PractitionerService) { }

  ngOnInit() {
    this.resetPractitioner();
  }

  resetPractitioner() {
    const photo: string = this.practitioner != null ? this.practitioner.photo : null;
    this.practitionerPhoto = { photo };
    this.loading = false;
    this.success = false;
    this.error = false;
  }

  onOverlayClick() {
    this.overlayClick.emit();
  }

  save() {
    this.loading = true;
    const practitionerToSave: Practitioner = {
      ...this.practitioner,
      ...this.practitionerPhoto
    };
    this.practitionerService.save(practitionerToSave).subscribe(
      (id: string) => {
        this.success = true;
        this.error = false;
        this.loading = false;
        setTimeout(() => {
          this.success = false;
          // practitionerToSave.id = id;
          this.practitionerSaved.emit(practitionerToSave);
        }, 3000);
      },
      () => {
        this.error = true;
        this.loading = false;
      }
    );
  }

}
