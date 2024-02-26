import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEpisodeComponent } from './add-new-episode.component';

describe('AddNewEpisodeComponent', () => {
  let component: AddNewEpisodeComponent;
  let fixture: ComponentFixture<AddNewEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewEpisodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
