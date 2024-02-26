import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAdvertisersComponent } from './filter-advertisers.component';

describe('FilterAdvertisersComponent', () => {
  let component: FilterAdvertisersComponent;
  let fixture: ComponentFixture<FilterAdvertisersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterAdvertisersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterAdvertisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
