import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAddToCardModalComponent } from './ad-add-to-card-modal.component';

describe('AdAddToCardModalComponent', () => {
  let component: AdAddToCardModalComponent;
  let fixture: ComponentFixture<AdAddToCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdAddToCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdAddToCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
