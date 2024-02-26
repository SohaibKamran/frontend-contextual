import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPDFModalComponent } from './export-pdfmodal.component';

describe('ExportPDFModalComponent', () => {
  let component: ExportPDFModalComponent;
  let fixture: ComponentFixture<ExportPDFModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPDFModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPDFModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
