import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavShowsComponent } from './fav-shows.component';

describe('FavShowsComponent', () => {
  let component: FavShowsComponent;
  let fixture: ComponentFixture<FavShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavShowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
