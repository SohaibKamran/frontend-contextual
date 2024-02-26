import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosTopWidgetComponent } from './videos-top-widget.component';

describe('VideosTopWidgetComponent', () => {
  let component: VideosTopWidgetComponent;
  let fixture: ComponentFixture<VideosTopWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosTopWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosTopWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
