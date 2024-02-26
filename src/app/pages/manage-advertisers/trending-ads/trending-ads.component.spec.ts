import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingAdsComponent } from './trending-ads.component';

describe('TrendingAdsComponent', () => {
  let component: TrendingAdsComponent;
  let fixture: ComponentFixture<TrendingAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingAdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
