import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcanvasLoginComponent } from './offcanvas-login.component';

describe('OffcanvasLoginComponent', () => {
  let component: OffcanvasLoginComponent;
  let fixture: ComponentFixture<OffcanvasLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffcanvasLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffcanvasLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
