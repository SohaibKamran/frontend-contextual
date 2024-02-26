import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAnnotatorComponent } from './add-edit-annotator.component';

describe('AddEditAnnotatorComponent', () => {
  let component: AddEditAnnotatorComponent;
  let fixture: ComponentFixture<AddEditAnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAnnotatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
