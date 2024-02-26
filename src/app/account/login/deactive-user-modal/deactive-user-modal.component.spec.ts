import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactiveUserModalComponent } from './deactive-user-modal.component';

describe('DeactiveUserModalComponent', () => {
  let component: DeactiveUserModalComponent;
  let fixture: ComponentFixture<DeactiveUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactiveUserModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactiveUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
