import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneMappingComponent } from './scene-mapping.component';

describe('SceneMappingComponent', () => {
  let component: SceneMappingComponent;
  let fixture: ComponentFixture<SceneMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
