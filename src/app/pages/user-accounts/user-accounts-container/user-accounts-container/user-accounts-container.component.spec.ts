import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsContainerComponent } from './user-accounts-container.component';

describe('UserAccountsContainerComponent', () => {
  let component: UserAccountsContainerComponent;
  let fixture: ComponentFixture<UserAccountsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
