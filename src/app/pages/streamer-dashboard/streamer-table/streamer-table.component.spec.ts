import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerTableComponent } from './streamer-table.component';

describe('StreamerTableComponent', () => {
  let component: StreamerTableComponent;
  let fixture: ComponentFixture<StreamerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
