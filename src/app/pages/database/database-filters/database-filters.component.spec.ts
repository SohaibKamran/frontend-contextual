import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseFiltersComponent } from './database-filters.component';

describe('DatabaseFiltersComponent', () => {
  let component: DatabaseFiltersComponent;
  let fixture: ComponentFixture<DatabaseFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
