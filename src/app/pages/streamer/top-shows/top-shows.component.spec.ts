import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopShowsComponent } from './top-shows.component';

describe('TopShowsComponent', () => {
  let component: TopShowsComponent;
  let fixture: ComponentFixture<TopShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopShowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
