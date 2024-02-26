import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneSubmittedModalComponent } from './scene-submitted-modal.component';

describe('SceneSubmittedModalComponent', () => {
  let component: SceneSubmittedModalComponent;
  let fixture: ComponentFixture<SceneSubmittedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneSubmittedModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneSubmittedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
