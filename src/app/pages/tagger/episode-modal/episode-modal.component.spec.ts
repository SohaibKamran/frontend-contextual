import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeModalComponent } from './episode-modal.component';

describe('EpisodeModalComponent', () => {
  let component: EpisodeModalComponent;
  let fixture: ComponentFixture<EpisodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpisodeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
