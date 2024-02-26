import { Component } from '@angular/core';
import { NgbActiveModal, NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-deactive-user-modal',
  templateUrl: './deactive-user-modal.component.html',
  styleUrls: ['./deactive-user-modal.component.scss']
})
export class DeactiveUserModalComponent {
  name: string = '';
  email: string = '';
  company: string = '';
  title: string = '';

  constructor(private activeModal: NgbActiveModal, private toastService: ToastrService, private apiService: ApiService) { }

  CloseModal() {
    this.activeModal.close('close')
  }

  onSubmit(): void {
    const formData = {
      name: this.name,
      email: this.email,
      company: this.company,
      title: this.title,
    };
    this.apiService.sendRequest(requests.sendReactivationRequest, 'post', formData).subscribe((res) => {

      this.toastService.success('Your request has been submitted successfully!');
    });

  }

}
