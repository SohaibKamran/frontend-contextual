import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargestAdInventoriesComponent } from './largest-ad-inventories.component';

describe('LargestAdInventoriesComponent', () => {
  let component: LargestAdInventoriesComponent;
  let fixture: ComponentFixture<LargestAdInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargestAdInventoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargestAdInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
