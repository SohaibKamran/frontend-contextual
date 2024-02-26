import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { requests } from 'src/app/core/config/config';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-download-database-modal',
  templateUrl: './download-database-modal.component.html',
  styleUrls: ['./download-database-modal.component.scss']
})
export class DownloadDatabaseModalComponent {

  password = new FormControl(null, [Validators.required, Validators.minLength(8)])
  downloadProgress: any
  submit: boolean = true
  submitButton: boolean = false
  constructor(private apiService: ApiService, private toastrService: ToastrService, private activeModal: NgbActiveModal) { }
  downloadDatabase() {
    if (this.password.valid) {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('POST', requests.downloadDatabase, true);
      this.error(xhr)
      this.onProgress(xhr)
      const requestBody = JSON.stringify({
        // Your request body data here
        requestPurpose: 'download',
        password: this.password.value
      });
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(requestBody);
    }
  }

  onProgress(xhr: XMLHttpRequest) {
    xhr.onprogress = (event) => {
      console.log(event)
      var contentType = xhr.getResponseHeader("Content-Type");
      console.log(contentType, 'Content Type')
      if (contentType == "application/json; charset=utf-8") {
        this.submit = true
      }
      else {
        if (event.lengthComputable) {
          this.submit = false
          const progress = (event.loaded / event.total) * 100;
          this.downloadProgress = parseInt(progress.toFixed(2));
          console.log(this.downloadProgress)
        }
      }
      this.onLoad(xhr)

    }
  }
  onLoad(xhr: XMLHttpRequest) {
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.toastrService.success("Database Downloaded Successfully!")
        this.activeModal.close()
        const blob = xhr.response;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'database-.zip';
        link.click();
        URL.revokeObjectURL(link.href);
      }
      else {
        this.submit = true
        console.log(xhr.response)
        this.toastrService.error("Incorrect Password!")
      }
    }
  }
  error(xhr: XMLHttpRequest) {
    xhr.onerror = () => {
      this.toastrService.error("Database Download Failed!")
      console.error('Error: Network error');
      // Handle network-related errors here
    };
  }
  close() {
    this.activeModal.close()
  }
}
