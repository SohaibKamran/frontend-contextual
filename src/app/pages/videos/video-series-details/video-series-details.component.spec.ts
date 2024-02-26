import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSeriesDetailsComponent } from './video-series-details.component';

describe('VideoSeriesDetailsComponent', () => {
  let component: VideoSeriesDetailsComponent;
  let fixture: ComponentFixture<VideoSeriesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoSeriesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSeriesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
