import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecordModalComponent } from './product-record-modal.component';

describe('ProductRecordModalComponent', () => {
  let component: ProductRecordModalComponent;
  let fixture: ComponentFixture<ProductRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRecordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
