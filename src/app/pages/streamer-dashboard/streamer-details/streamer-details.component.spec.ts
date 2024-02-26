import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerDetailsComponent } from './streamer-details.component';

describe('StreamerDetailsComponent', () => {
  let component: StreamerDetailsComponent;
  let fixture: ComponentFixture<StreamerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
