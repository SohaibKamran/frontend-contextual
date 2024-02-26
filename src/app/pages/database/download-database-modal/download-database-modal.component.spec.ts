import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDatabaseModalComponent } from './download-database-modal.component';

describe('DownloadDatabaseModalComponent', () => {
  let component: DownloadDatabaseModalComponent;
  let fixture: ComponentFixture<DownloadDatabaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadDatabaseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDatabaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
