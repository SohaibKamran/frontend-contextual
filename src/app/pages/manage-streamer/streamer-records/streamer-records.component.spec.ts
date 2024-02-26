import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerRecordsComponent } from './streamer-records.component';

describe('StreamerRecordsComponent', () => {
  let component: StreamerRecordsComponent;
  let fixture: ComponentFixture<StreamerRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
