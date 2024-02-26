import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { sendResetEmail, updatePassword } from '../core/constants';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class ResetpasService {
  public sendResetEmailForm: FormGroup;
  public setPasswordForm: FormGroup;

  constructor(private http: HttpClient, fb: FormBuilder, private apiService: ApiService) {
    this.sendResetEmailForm = fb.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    })
    this.setPasswordForm = fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    })
  }

     // Api Endpoints
  sentResetLink(body) {
    // return this.http.post(sendResetEmail, body);
  }

  updatePassword(body) {
    // return this.http.post(updatePassword, body);
  }
}
