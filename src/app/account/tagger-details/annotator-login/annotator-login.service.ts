import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginUrl } from '../../../core/constants';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class AnnotatorLoginService {
  public loginForm: FormGroup;
  constructor(fb: FormBuilder, private apiService: ApiService) {
    this.loginForm = fb.group({
      email: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    })
  }
  login = (body: any) => {
    return this.apiService.sendRequest(loginUrl, 'post', body)
  }
}
