import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserRecordsComponent } from './advertiser-records.component';

describe('AdvertiserRecordsComponent', () => {
  let component: AdvertiserRecordsComponent;
  let fixture: ComponentFixture<AdvertiserRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertiserRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertiserRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
