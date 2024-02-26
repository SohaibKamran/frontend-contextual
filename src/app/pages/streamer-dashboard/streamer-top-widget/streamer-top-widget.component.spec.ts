import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerTopWidgetComponent } from './streamer-top-widget.component';

describe('StreamerTopWidgetComponent', () => {
  let component: StreamerTopWidgetComponent;
  let fixture: ComponentFixture<StreamerTopWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerTopWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerTopWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
