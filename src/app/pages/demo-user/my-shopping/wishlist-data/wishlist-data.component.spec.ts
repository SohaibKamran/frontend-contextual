import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistDataComponent } from './wishlist-data.component';

describe('WishlistDataComponent', () => {
  let component: WishlistDataComponent;
  let fixture: ComponentFixture<WishlistDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
