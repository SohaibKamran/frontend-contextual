import { Component, OnInit } from '@angular/core';
import { TaggerResetPasswordService } from '../tagger-reset-password.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

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
    private resetPassService: TaggerResetPasswordService,
    private router: Router,
    private toastr: ToastrService){

  }

  ngOnInit(): void {
    this.sendResetEmailForm = this.resetPassService.sendResetEmailForm
    this.sendResetEmailForm.reset()
  }

  sendResetLink() {
    this.sendResetEmailForm.markAllAsTouched()
    if (this.sendResetEmailForm.valid) {
      this.resetPassService.sentResetLink(this.sendResetEmailForm.value).subscribe(
        (response: any) => {
          this.router.navigate(['/tagger-reset-password/verify-email']);
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
