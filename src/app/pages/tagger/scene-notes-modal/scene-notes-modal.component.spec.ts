import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneNotesModalComponent } from './scene-notes-modal.component';

describe('SceneNotesModalComponent', () => {
  let component: SceneNotesModalComponent;
  let fixture: ComponentFixture<SceneNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneNotesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
