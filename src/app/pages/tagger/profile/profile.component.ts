/* eslint-disable prefer-const */
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { ProfileService } from './profile.service'
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/core/services/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any
  countries = [];
  public updateProfileForm: FormGroup
  isError = false;
  errorMessage = "";
  bankCountryId = null;
  countryId = null;
  role
  constructor(
    private profileService: ProfileService,
    private fileUploadService: UploadService,
    // private toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private loader: NgxSpinnerService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.role= JSON.parse(localStorage.getItem('role'));
    console.log(this.role,"role")
    this.updateProfileForm = this.profileService.updateProfileForm
    if (this.router.url == '/profile') {
      this.sharedService.showToolbar = true;
    }
    this.updateProfileForm.reset()
    this.getCountries()
  }
  getProfileDetails = () => {
    this.loader.show()
    this.profileService.getProfileDetail()
      .subscribe(
        (response: any) => {
          this.profileData = response.data;
          this.bankCountryId = this.profileData.bankCountryId;
          this.countryId = this.profileData.countryId;
          const country = this.countries.find(c => c.phone == this.profileData.countryCode)
          this.updateProfileForm.patchValue({
            firstName: this.profileData.firstName,
            lastName: this.profileData.lastName,
            profilePicture: this.profileData.profilePicture,
            title: this.profileData.title,
            company: this.profileData.company,
            email: this.profileData.email,
            countryCode: +country?.id,
            phoneNo: this.profileData.phoneNo,
            address: this.profileData.address,
            state: this.profileData.state,
            zipCode: this.profileData.zipCode,
            country: this.profileData.countryId,
            bankCountry: this.profileData.bankCountryId,
            city: this.profileData.city,
            province: this.profileData.provinceOrRegion,
            bankRoutingNumber: this.profileData.bankRoutingNo,
            recipientAccountNumber: this.profileData.recipientAccountNo,
            recipientTaxId: this.profileData.recipientTaxId,
          });
          this.loader.hide()
        },
        (err) => {
          this.loader.hide()
          // this.toastr.error(err?.error?.message, "Error")
        }
      )
  }
  getCountries = () => {
    this.loader.show()
    this.profileService.getCountries().subscribe(
      (response: any) => {
        this.countries = response?.data?.countries?.rows
        this.getProfileDetails()
        this.loader.hide();
      },
      (err) => {
        this.loader.hide();
        // this.toastr.error(err?.error?.message, "Error")
      }
    )
  }
  onChange(country) {
    this.updateProfileForm.controls['countryCode'].patchValue(+country?.id)
  }
  file: any = null;
  error: boolean = false;
  onImageChange(event) {
    this.file = event.target.files[0];
    if (!this.file?.type?.includes('image')) {
      this.error = true;
      return;
    }
    else {
      this.fileUploadService.uploadFile({ file: this.file }).subscribe(
        (res: any) => {
          this.updateProfileForm.controls['profilePicture'].patchValue(res[0]);
          this.updateProfile()
        }
      );
      this.error = false;
    }
  }
  selectCountry = (event) => {
    this.updateProfileForm.controls['country'].patchValue(Object.keys(event.target.value).length !== 0 ? event.target.value.toString() : null)
  }
  selectBankCountry = (event) => {
    this.updateProfileForm.controls['bankCountry'].patchValue(Object.keys(event.target.value).length !== 0 ? event.target.value.toString() : null)
  }
  updateProfile = () => {
    const { firstName, lastName, profilePicture, oldPassword, newPassword, address,
       country, bankCountry, city, province, bankRoutingNumber, recipientAccountNumber, recipientTaxId,
      title,
      company,
      email,
      countryCode,
      phoneNo,
      state,
      zipCode
    } = this.updateProfileForm.value;
    const countryCodeObj = this.countries.find(c => c.id == countryCode);
    let obj = {
      firstName: firstName?.trim()??undefined,
      lastName: lastName?.trim()??undefined,
      profilePicture: profilePicture?.trim()??undefined,
      title: title?.trim()??undefined,
      company: company?.trim()??undefined,
      address: address?.trim()??undefined,
      email: email?.trim()??undefined,
      phoneNo: phoneNo?.trim()??undefined,
      state: state?.trim()??undefined,
      zipCode: zipCode?.trim()??undefined,
      countryId: country??undefined,
      bankCountryId: bankCountry??undefined,
      city: city?.trim()??undefined,
      provinceOrRegion: province?.trim()??undefined,
      bankRoutingNo: bankRoutingNumber?.trim()??undefined,
      recipientAccountNo: recipientAccountNumber?.trim()??undefined,
      recipientTaxId: recipientTaxId?.trim()??undefined,
    };
    if (oldPassword != null && newPassword != null) {
      if (oldPassword.trim() == "") {
        this.isError = true;
        this.errorMessage = "Enter valid old password";
        return;
      }
      else if (newPassword.trim() == "") {
        this.isError = true;
        this.errorMessage = "Enter valid old password";
        return;
      }
      obj['oldPassword'] = oldPassword,
        obj['newPassword'] = newPassword
    }
    else if (oldPassword != null && oldPassword.trim() !== "" && newPassword == null) {
      this.isError = true;
      this.errorMessage = "Fill both old and new password";
      return;
    }
    else if (oldPassword == null && newPassword != null && newPassword.trim() !== "") {
      this.isError = true;
      this.errorMessage = "Fill both old and new password";
    }
    this.loader.show()
    this.profileService.updateProfileDetail(obj)
      .subscribe(
        (response: any) => {
          // this.toastr.success("Profile updated successfully", "Success")
          this.isError = false;
          this.updateProfileForm.reset()
          this.toastrService.success("Profile Updated Successfully.")
          this.getProfileDetails()
          this.loader.hide()
        },
        (err) => {
          this.isError = true;
          this.loader.hide()
          this.errorMessage = err?.error?.message;
        }
      )
  }

}
