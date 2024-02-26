import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaBuysComponent } from './media-buys.component';

describe('MediaBuysComponent', () => {
  let component: MediaBuysComponent;
  let fixture: ComponentFixture<MediaBuysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaBuysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaBuysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
