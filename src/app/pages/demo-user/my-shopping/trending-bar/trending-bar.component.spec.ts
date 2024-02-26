import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingBarComponent } from './trending-bar.component';

describe('TrendingBarComponent', () => {
  let component: TrendingBarComponent;
  let fixture: ComponentFixture<TrendingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
