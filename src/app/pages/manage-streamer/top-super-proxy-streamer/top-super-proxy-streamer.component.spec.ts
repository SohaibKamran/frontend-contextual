import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSuperProxyStreamerComponent } from './top-super-proxy-streamer.component';

describe('TopSuperProxyStreamerComponent', () => {
  let component: TopSuperProxyStreamerComponent;
  let fixture: ComponentFixture<TopSuperProxyStreamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopSuperProxyStreamerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSuperProxyStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
