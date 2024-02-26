import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerRegisterComponent } from './tagger-register.component';

describe('TaggerRegisterComponent', () => {
  let component: TaggerRegisterComponent;
  let fixture: ComponentFixture<TaggerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaggerRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaggerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
