import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSuperProxiesComponent } from './top-super-proxies.component';

describe('TopSuperProxiesComponent', () => {
  let component: TopSuperProxiesComponent;
  let fixture: ComponentFixture<TopSuperProxiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopSuperProxiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSuperProxiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
