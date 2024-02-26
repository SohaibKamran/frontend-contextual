import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingShowsComponent } from './trending-shows.component';

describe('TrendingShowsComponent', () => {
  let component: TrendingShowsComponent;
  let fixture: ComponentFixture<TrendingShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingShowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
