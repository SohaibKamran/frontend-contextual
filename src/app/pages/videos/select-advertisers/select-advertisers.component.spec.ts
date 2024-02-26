import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdvertisersComponent } from './select-advertisers.component';

describe('SelectAdvertisersComponent', () => {
  let component: SelectAdvertisersComponent;
  let fixture: ComponentFixture<SelectAdvertisersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAdvertisersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAdvertisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
