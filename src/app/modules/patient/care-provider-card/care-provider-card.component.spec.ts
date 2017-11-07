import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareProviderCardComponent } from './care-provider-card.component';

describe('CareProviderCardComponent', () => {
  let component: CareProviderCardComponent;
  let fixture: ComponentFixture<CareProviderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareProviderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareProviderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
