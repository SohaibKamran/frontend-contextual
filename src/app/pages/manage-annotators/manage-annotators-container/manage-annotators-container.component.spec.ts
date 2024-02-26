import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnnotatorsContainerComponent } from './manage-annotators-container.component';

describe('ManageAnnotatorsContainerComponent', () => {
  let component: ManageAnnotatorsContainerComponent;
  let fixture: ComponentFixture<ManageAnnotatorsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAnnotatorsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAnnotatorsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
