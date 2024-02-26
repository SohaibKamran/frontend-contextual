import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterScenesModalComponent } from './filter-scenes-modal.component';

describe('FilterScenesModalComponent', () => {
  let component: FilterScenesModalComponent;
  let fixture: ComponentFixture<FilterScenesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterScenesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterScenesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
