import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudCostsComponent } from './cloud-costs.component';

describe('CloudCostsComponent', () => {
  let component: CloudCostsComponent;
  let fixture: ComponentFixture<CloudCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudCostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
