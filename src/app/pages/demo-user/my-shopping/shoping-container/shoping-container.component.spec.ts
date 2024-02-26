import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopingContainerComponent } from './shoping-container.component';

describe('ShopingContainerComponent', () => {
  let component: ShopingContainerComponent;
  let fixture: ComponentFixture<ShopingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopingContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
