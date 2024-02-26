import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingActorsComponent } from './trending-actors.component';

describe('TrendingActorsComponent', () => {
  let component: TrendingActorsComponent;
  let fixture: ComponentFixture<TrendingActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
