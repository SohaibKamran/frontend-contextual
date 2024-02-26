import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIComponent } from './card-i.component';

describe('CardIComponent', () => {
  let component: CardIComponent;
  let fixture: ComponentFixture<CardIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
