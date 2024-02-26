import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdvertisersContainerComponent } from './manage-advertisers-container.component';

describe('ManageAdvertisersContainerComponent', () => {
  let component: ManageAdvertisersContainerComponent;
  let fixture: ComponentFixture<ManageAdvertisersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAdvertisersContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAdvertisersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
