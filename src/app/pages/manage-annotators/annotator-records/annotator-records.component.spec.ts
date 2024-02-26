import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorRecordsComponent } from './annotator-records.component';

describe('AnnotatorRecordsComponent', () => {
  let component: AnnotatorRecordsComponent;
  let fixture: ComponentFixture<AnnotatorRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotatorRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotatorRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
