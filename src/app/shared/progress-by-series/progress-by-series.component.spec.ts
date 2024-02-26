import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBySeriesComponent } from './progress-by-series.component';

describe('ProgressBySeriesComponent', () => {
  let component: ProgressBySeriesComponent;
  let fixture: ComponentFixture<ProgressBySeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressBySeriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressBySeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
