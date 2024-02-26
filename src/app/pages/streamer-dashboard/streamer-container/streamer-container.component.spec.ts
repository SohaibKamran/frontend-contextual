import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerContainerComponent } from './streamer-container.component';

describe('StreamerContainerComponent', () => {
  let component: StreamerContainerComponent;
  let fixture: ComponentFixture<StreamerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
