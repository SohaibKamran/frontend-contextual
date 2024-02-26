// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterService } from './register.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROLES } from './roles';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/pages/tagger/profile/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registrationForm: FormGroup
  public countries = [];
  public heading = "Select Country"
  acceptTerms = false;
  isError = false;
  errorMessage = ""
  role= 'user'
  ngOnInit() {
    this.registrationForm = this.registrationService.registrationForm
    this.registrationForm.reset()
    this.getCountries()
  }
  constructor(public registrationService: RegisterService, public router: Router, private toastr: ToastrService,
    private profileService: ProfileService,
    private loader: NgxSpinnerService,
    private modalService: NgbModal
  ) { }

  onChange(country) {
    this.registrationForm.controls['countryCode'].patchValue(country?.phone?.toString())
  }

  getCountries = () => {
    this.loader.show()
    this.profileService.getCountries().subscribe(
      (response: any) => {
        this.countries = response?.data?.countries?.rows
        this.loader.hide();
      },
      (err) => {
        this.loader.hide();
      }
    )
  }

  openScrollableContent(content1) {
    this.modalService.open(content1, { scrollable: true, windowClass: 'modal-md' });
  }

  register = () => {

    this.registrationForm.markAllAsTouched()
    if (this.registrationForm.valid) {
      const { email, firstName, lastName, title, company, password, countryCode, phoneNo } = this.registrationForm.value
      const body = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        title: title?.trim(),
        company: company?.trim(),
        password: password?.trim(),
        phoneNo: phoneNo?.trim(),
        email: email?.trim(),
        role: ROLES.viewer
      }
      this.registrationService.register(body).subscribe(
        (response: any) => {
          this.toastr.success(response.message, "Success")
          this.isError = false;
          this.router.navigate(['/register/success'], {
            queryParams: {
              role: this.role
            }
          })
        },
        (err) => {
          this.isError = true;
          this.errorMessage = err?.error?.message;
        }
      )
    }
  }
  // getCountries = () => {
  //   this.registrationService.getCountries().subscribe(
  //     (response: any) => {
  //       this.countries = response.data.countries
  //     }
  //   )
  // }
  toggleTermsCheckbox() {
    this.acceptTerms = !this.acceptTerms
  }
  // selectCountry = (event) => {
  //   this.registrationForm.controls['countryId'].patchValue(Object.keys(event.value).length !== 0 ? event.value.id.toString() : null)
  // }
}

