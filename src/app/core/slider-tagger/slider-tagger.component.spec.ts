import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTaggerComponent } from './slider-tagger.component';

describe('SliderTaggerComponent', () => {
  let component: SliderTaggerComponent;
  let fixture: ComponentFixture<SliderTaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderTaggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderTaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
