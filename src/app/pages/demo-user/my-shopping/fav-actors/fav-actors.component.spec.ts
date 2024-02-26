import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavActorsComponent } from './fav-actors.component';

describe('FavActorsComponent', () => {
  let component: FavActorsComponent;
  let fixture: ComponentFixture<FavActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
