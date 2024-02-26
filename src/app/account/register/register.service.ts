import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerUrl } from 'src/app/core/constants';
// import { getAllCountries, registerUrl } from '../core/constants';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public registrationForm: FormGroup
  constructor(fb: FormBuilder, private httpService: HttpClient) {
    this.registrationForm = fb.group({
      firstName: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      lastName: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.minLength(8)]],
      countryCode: [null],
      phoneNo: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      title: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      company: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
      // countryId: [null, Validators.required],
      // role : ["1"]
    })
  }

  //Api endpoints (registerUrl, getAllCountries)

  register = (body: any) => {
    return this.httpService.post(registerUrl, body)
  }
  //   getCountries = () => {
  //     return this.httpService.get(getAllCountries)
  //   }
}
