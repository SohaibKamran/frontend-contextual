import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerRegisterSuccessComponent } from './tagger-register-success.component';

describe('TaggerRegisterSuccessComponent', () => {
  let component: TaggerRegisterSuccessComponent;
  let fixture: ComponentFixture<TaggerRegisterSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaggerRegisterSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaggerRegisterSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
