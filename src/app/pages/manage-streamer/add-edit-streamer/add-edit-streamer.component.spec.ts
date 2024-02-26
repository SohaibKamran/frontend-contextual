import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStreamerComponent } from './add-edit-streamer.component';

describe('AddEditStreamerComponent', () => {
  let component: AddEditStreamerComponent;
  let fixture: ComponentFixture<AddEditStreamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditStreamerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
