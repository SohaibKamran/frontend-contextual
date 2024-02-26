import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperDataModalComponent } from './super-data-modal.component';

describe('SuperDataModalComponent', () => {
  let component: SuperDataModalComponent;
  let fixture: ComponentFixture<SuperDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
