import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTagInfoComponent } from './product-tag-info.component';

describe('ProductTagInfoComponent', () => {
  let component: ProductTagInfoComponent;
  let fixture: ComponentFixture<ProductTagInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTagInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTagInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
