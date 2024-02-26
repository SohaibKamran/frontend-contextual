import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageVzotScoreComponent } from './average-vzot-score.component';

describe('AverageVzotScoreComponent', () => {
  let component: AverageVzotScoreComponent;
  let fixture: ComponentFixture<AverageVzotScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageVzotScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageVzotScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
