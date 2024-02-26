import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStreamerContainerComponent } from './manage-streamer-container.component';

describe('ManageStreamerContainerComponent', () => {
  let component: ManageStreamerContainerComponent;
  let fixture: ComponentFixture<ManageStreamerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStreamerContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStreamerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
