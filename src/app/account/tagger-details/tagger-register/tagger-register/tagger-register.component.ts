import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROLES } from 'src/app/account/register/roles';
import { TaggerRegisterService } from '../tagger-register-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tagger-register',
  templateUrl: './tagger-register.component.html',
  styleUrls: ['./tagger-register.component.scss']
})
export class TaggerRegisterComponent implements OnInit {

  public registrationForm: FormGroup
  public countries = [];
  public heading = "Select Country"
  acceptTerms = false;
  isError = false;
  errorMessage = ""
  role = 'tagger'
  constructor(
    public registrationService: TaggerRegisterService,
    public router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {


    this.registrationForm = this.registrationService.registrationForm
    this.registrationForm.reset()
    this.getCountries()
  }

  openScrollableContent(content1) {
    this.modalService.open(content1, { scrollable: true, windowClass: 'modal-md' });
  }

  register = () => {

    this.registrationForm.markAllAsTouched()
    if (this.registrationForm.valid) {
      const { firstName, lastName, email, address, city, province, country, bankCountry, bankRoutingNumber,
        recipientAccountNumber, verifyRecipientAccountNumber, recipientTaxId, password
      } = this.registrationForm.value
      if (recipientAccountNumber == verifyRecipientAccountNumber) {
        const body = {
          firstName: firstName?.trim(),
          lastName: lastName?.trim(),
          password: password?.trim(),
          email: email?.trim(),
          address: address?.trim(),
          city: city?.trim(),
          provinceOrRegion: province?.trim(),
          countryId: country !== null ? parseInt(country) : undefined,
          bankCountryId: bankCountry !== null ? parseInt(bankCountry) : undefined,
          bankRoutingNo: bankRoutingNumber?.trim(),
          recipientAccountNo: recipientAccountNumber?.trim(),
          recipientTaxId: recipientTaxId?.trim(),
          role: ROLES.tagger
        }
        this.registrationService.register(body).subscribe(
          (response: any) => {
            this.toastr.success(response.message, "Success")
            this.isError = false;
            this.router.navigate(['/register/success'], {
              queryParams: {
                role: this.role,
              }
            })
          },
          (err) => {
            this.isError = true;
            this.errorMessage = err?.error?.message;
          }
        )
      }
      else {
        this.isError = true;
        this.errorMessage = "Recipient Account No and Verify Recipient Account No must be same";
      }
    }
  }
  getCountries = () => {
    this.registrationService.getCountries().subscribe(
      (response: any) => {
        this.countries = response?.data?.countries?.rows
      }
    )
  }
  toggleTermsCheckbox() {
    this.acceptTerms = !this.acceptTerms
  }
  selectCountry = (event) => {
    this.registrationForm.controls['country'].patchValue(Object.keys(event.target.value).length !== 0 ? event.target.value.toString() : null)
  }
  selectBankCountry = (event) => {
    this.registrationForm.controls['bankCountry'].patchValue(Object.keys(event.target.value).length !== 0 ? event.target.value.toString() : null)
  }

}
