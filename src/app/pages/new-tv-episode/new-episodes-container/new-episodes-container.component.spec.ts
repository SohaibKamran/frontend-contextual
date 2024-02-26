import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEpisodesContainerComponent } from './new-episodes-container.component';

describe('NewEpisodesContainerComponent', () => {
  let component: NewEpisodesContainerComponent;
  let fixture: ComponentFixture<NewEpisodesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEpisodesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEpisodesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
