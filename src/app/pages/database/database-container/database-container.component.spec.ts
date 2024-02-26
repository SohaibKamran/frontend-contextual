import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseContainerComponent } from './database-container.component';

describe('DatabaseContainerComponent', () => {
  let component: DatabaseContainerComponent;
  let fixture: ComponentFixture<DatabaseContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
