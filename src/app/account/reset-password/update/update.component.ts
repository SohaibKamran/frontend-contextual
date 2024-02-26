import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetpasService } from '../resetpas.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  
  public setPasswordForm: FormGroup;
  public token: string;
  isError = false;
  errorMessage = ""

  constructor(
    private resetPassService: ResetpasService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit() {
    this.setPasswordForm = this.resetPassService.setPasswordForm
    this.token = this.route.snapshot.queryParams['token'];
  }
  
  updatePassword() {
    const { newPassword, confirmPassword } = this.setPasswordForm.value;
    if (newPassword.trim() === confirmPassword.trim()) {
      this.setPasswordForm.markAllAsTouched()
      if (this.setPasswordForm.valid) {
        const body = {
          newPassword,
          token: this.token
        }
        this.resetPassService.updatePassword(body).subscribe(
          (response: any) => {
            this.router.navigate(['/login']);
            this.isError = false;
            this.toastr.success(response?.message, "Success")
          },
          (err) => {
            this.isError = true;
            this.errorMessage = err?.error?.message;
          }
        )
      }
    }
    else {
      this.isError = true;
      this.errorMessage = "Password and Confirm password must be same.";
      return;
    }
  }


}
