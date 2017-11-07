import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerPhotoDialogComponent } from './practitioner-photo-dialog.component';

describe('PractitionerPhotoDialogComponent', () => {
  let component: PractitionerPhotoDialogComponent;
  let fixture: ComponentFixture<PractitionerPhotoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerPhotoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerPhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
