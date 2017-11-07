import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerChooserComponent } from './practitioner-chooser.component';

describe('PractitionerChooserComponent', () => {
  let component: PractitionerChooserComponent;
  let fixture: ComponentFixture<PractitionerChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
