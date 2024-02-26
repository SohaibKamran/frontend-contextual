import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderAiComponent } from './slider-ai.component';

describe('SliderAiComponent', () => {
  let component: SliderAiComponent;
  let fixture: ComponentFixture<SliderAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderAiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
