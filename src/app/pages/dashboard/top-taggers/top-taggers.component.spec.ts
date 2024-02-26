import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTaggersComponent } from './top-taggers.component';

describe('TopTaggersComponent', () => {
  let component: TopTaggersComponent;
  let fixture: ComponentFixture<TopTaggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTaggersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTaggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
