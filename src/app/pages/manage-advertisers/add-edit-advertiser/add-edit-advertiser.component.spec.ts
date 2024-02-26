import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdvertiserComponent } from './add-edit-advertiser.component';

describe('AddEditAdvertiserComponent', () => {
  let component: AddEditAdvertiserComponent;
  let fixture: ComponentFixture<AddEditAdvertiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAdvertiserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAdvertiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
