import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAlertComponent } from './ad-alert.component';

describe('AdAlertComponent', () => {
  let component: AdAlertComponent;
  let fixture: ComponentFixture<AdAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
