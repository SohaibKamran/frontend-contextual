import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderProxyComponent } from './slider-proxy.component';

describe('SliderProxyComponent', () => {
  let component: SliderProxyComponent;
  let fixture: ComponentFixture<SliderProxyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderProxyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
