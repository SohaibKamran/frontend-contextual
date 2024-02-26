import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { requests } from 'src/app/core/config/config';
@Component({
  selector: 'app-export-pdfmodal',
  templateUrl: './export-pdfmodal.component.html',
  styleUrls: ['./export-pdfmodal.component.scss']
})
export class ExportPDFModalComponent {

  constructor(private activeModal: NgbActiveModal){}

  ngOnInit() {
    console.log("Export PDF Modal")
  }
  closeModal() {
    
    this.activeModal.close('close')

  }

}
