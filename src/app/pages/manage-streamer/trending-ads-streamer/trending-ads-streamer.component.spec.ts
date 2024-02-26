import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingAdsStreamerComponent } from './trending-ads-streamer.component';

describe('TrendingAdsStreamerComponent', () => {
  let component: TrendingAdsStreamerComponent;
  let fixture: ComponentFixture<TrendingAdsStreamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingAdsStreamerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingAdsStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
