import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingRetailersComponent } from './trending-retailers.component';

describe('TrendingRetailersComponent', () => {
  let component: TrendingRetailersComponent;
  let fixture: ComponentFixture<TrendingRetailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingRetailersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingRetailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
