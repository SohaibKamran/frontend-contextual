import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignedEpisodesComponent } from './my-assigned-episodes.component';

describe('MyAssignedEpisodesComponent', () => {
  let component: MyAssignedEpisodesComponent;
  let fixture: ComponentFixture<MyAssignedEpisodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAssignedEpisodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAssignedEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
