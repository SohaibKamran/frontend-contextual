import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorsFilterComponent } from './annotators-filter.component';

describe('AnnotatorsFilterComponent', () => {
  let component: AnnotatorsFilterComponent;
  let fixture: ComponentFixture<AnnotatorsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotatorsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotatorsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
