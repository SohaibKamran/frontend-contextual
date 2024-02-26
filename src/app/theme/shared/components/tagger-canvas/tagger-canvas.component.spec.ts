import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerCanvasComponent } from './tagger-canvas.component';

describe('TaggerCanvasComponent', () => {
  let component: TaggerCanvasComponent;
  let fixture: ComponentFixture<TaggerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaggerCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaggerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
