import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmPercentageComponent } from './algorithm-percentage.component';

describe('AlgorithmPercentageComponent', () => {
  let component: AlgorithmPercentageComponent;
  let fixture: ComponentFixture<AlgorithmPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmPercentageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
