import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMobComponent } from './header-mob.component';

describe('HeaderMobComponent', () => {
  let component: HeaderMobComponent;
  let fixture: ComponentFixture<HeaderMobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderMobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
