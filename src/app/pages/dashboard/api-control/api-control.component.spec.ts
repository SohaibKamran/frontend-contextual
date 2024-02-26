import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiControlComponent } from './api-control.component';

describe('ApiControlComponent', () => {
  let component: ApiControlComponent;
  let fixture: ComponentFixture<ApiControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
