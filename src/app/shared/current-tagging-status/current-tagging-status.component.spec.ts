import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTaggingStatusComponent } from './current-tagging-status.component';

describe('CurrentTaggingStatusComponent', () => {
  let component: CurrentTaggingStatusComponent;
  let fixture: ComponentFixture<CurrentTaggingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentTaggingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentTaggingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
