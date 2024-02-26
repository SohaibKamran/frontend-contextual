import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserDetailsComponent } from './add-edit-user-details.component';

describe('AddEditUserDetailsComponent', () => {
  let component: AddEditUserDetailsComponent;
  let fixture: ComponentFixture<AddEditUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
