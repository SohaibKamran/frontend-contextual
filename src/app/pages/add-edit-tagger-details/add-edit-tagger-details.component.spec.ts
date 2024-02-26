import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTaggerDetailsComponent } from './add-edit-tagger-details.component';

describe('AddEditTaggerDetailsComponent', () => {
  let component: AddEditTaggerDetailsComponent;
  let fixture: ComponentFixture<AddEditTaggerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTaggerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTaggerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
