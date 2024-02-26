import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResetpasService } from '../resetpas.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  public sendResetEmailForm: FormGroup;
  isError = false;
  errorMessage = "";

  constructor(
    private resetPassService: ResetpasService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.sendResetEmailForm = this.resetPassService.sendResetEmailForm
    this.sendResetEmailForm.reset()
  }

  sendResetLink() {
    this.sendResetEmailForm.markAllAsTouched()
    if (this.sendResetEmailForm.valid) {
      this.resetPassService.sentResetLink(this.sendResetEmailForm.value).subscribe(
        (response: any) => {
          this.router.navigate(['/reset-password/verify-email']);
          this.isError = false;
        },
        (err) => {
          this.isError = true;
          this.errorMessage = err?.error?.message;
        }
      )
    }
  }
}
