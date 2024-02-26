// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TaggerRegisterServiceService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getAllCountries, registerUrl } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaggerRegisterService {
  public registrationForm: FormGroup
  constructor(fb: FormBuilder, private apiService: ApiService) {
    this.registrationForm = fb.group({
      firstName: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      lastName: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      address: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      city: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      province: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      country: [null],
      bankCountry: [null],
      bankRoutingNumber: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      recipientAccountNumber: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      verifyRecipientAccountNumber: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      recipientTaxId: [null, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      password: [null, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.minLength(8)]],
    })
  }
  register = (body: any) => {
    return this.apiService.sendRequest(registerUrl, 'post', body)
  }
  getCountries = () => {
    const body = {
      pageNo: 1,
      limit: 300
    }
    return this.apiService.sendRequest(getAllCountries, 'post', body)
  }
}

