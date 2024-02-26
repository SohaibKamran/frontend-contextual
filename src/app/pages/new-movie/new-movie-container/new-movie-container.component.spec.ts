import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMovieContainerComponent } from './new-movie-container.component';

describe('NewMovieContainerComponent', () => {
  let component: NewMovieContainerComponent;
  let fixture: ComponentFixture<NewMovieContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMovieContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMovieContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
