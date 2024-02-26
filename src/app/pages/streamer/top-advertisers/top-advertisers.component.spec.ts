import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAdvertisersComponent } from './top-advertisers.component';

describe('TopAdvertisersComponent', () => {
  let component: TopAdvertisersComponent;
  let fixture: ComponentFixture<TopAdvertisersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopAdvertisersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopAdvertisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
