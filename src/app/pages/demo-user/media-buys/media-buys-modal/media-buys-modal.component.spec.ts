import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaBuysModalComponent } from './media-buys-modal.component';

describe('MediaBuysModalComponent', () => {
  let component: MediaBuysModalComponent;
  let fixture: ComponentFixture<MediaBuysModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaBuysModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaBuysModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
