import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAnnotatorComponent } from './select-annotator.component';

describe('SelectAnnotatorComponent', () => {
  let component: SelectAnnotatorComponent;
  let fixture: ComponentFixture<SelectAnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAnnotatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
