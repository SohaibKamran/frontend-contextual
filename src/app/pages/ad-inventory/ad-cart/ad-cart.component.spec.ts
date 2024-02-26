import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCartComponent } from './ad-cart.component';

describe('AdCartComponent', () => {
  let component: AdCartComponent;
  let fixture: ComponentFixture<AdCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
