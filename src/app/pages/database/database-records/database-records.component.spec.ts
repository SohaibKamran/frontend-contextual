import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseRecordsComponent } from './database-records.component';

describe('DatabaseRecordsComponent', () => {
  let component: DatabaseRecordsComponent;
  let fixture: ComponentFixture<DatabaseRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
