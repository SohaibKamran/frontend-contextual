import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotatorLoginService } from './annotator-login.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { ROLES } from '../../register/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-annotator-login',
  templateUrl: './annotator-login.component.html',
  styleUrls: ['./annotator-login.component.scss']
})
export class AnnotatorLoginComponent implements OnInit {

  isAuthenticated = true;
  public loginForm: FormGroup
  acceptTerms = false;
  isError = false;
  errorMessage = ""

  constructor(
    private router: Router,
    private loginService: AnnotatorLoginService,
    private toastrService: ToastrService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    if (!this.isAuthenticated) {
      this.toastr.error("Please login first", "Error")
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      this.isAuthenticated = true
    }
    this.loginForm = this.loginService.loginForm
  }

  openScrollableContent(content1) {
    this.modalService.open(content1, { scrollable: true, windowClass: 'modal-md' });
  }

  login() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      const body = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: false,
        role: [ROLES.tagger, ROLES.superAdmin, ROLES.admin]
      }
      this.loginService.login(body).subscribe(
        (response: any) => {
          if (response['data']) {
            localStorage.setItem('token', response?.data?.token)
            localStorage.setItem('userId', response?.data?.userId)
            localStorage.setItem('role', response?.data?.roleId)
            localStorage.setItem('user', response?.data?.firstName)
            localStorage.setItem('lastLogin', response?.data?.lastLogin)
            //this.toastrService.success("Login Successful")
            if (response?.data?.roleId === 4)
              this.router.navigate(['/'])
            else if (response?.data?.roleId === 2)
              this.router.navigate(['/indexer'])
          } else {
            this.toastrService.error("Email or Password is incorrect!")
          }
        },
        (err) => {
          this.isError = true;
          this.errorMessage = err?.error?.message;
        }
      )
    }
  }
  toggleTermsCheckbox() {
    this.acceptTerms = !this.acceptTerms
  }
}
