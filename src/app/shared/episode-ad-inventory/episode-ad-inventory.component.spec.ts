import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeAdInventoryComponent } from './episode-ad-inventory.component';

describe('EpisodeAdInventoryComponent', () => {
  let component: EpisodeAdInventoryComponent;
  let fixture: ComponentFixture<EpisodeAdInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EpisodeAdInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeAdInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
