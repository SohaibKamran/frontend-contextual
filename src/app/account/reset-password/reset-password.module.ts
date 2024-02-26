import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UpdateComponent } from './update/update.component';
import { ResetComponent } from './reset/reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffcanvasLoginComponent } from 'src/app/theme/shared/components/offcanvas-login/offcanvas-login.component';



@NgModule({
  declarations: [
    VerifyEmailComponent,
    UpdateComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OffcanvasLoginComponent
    
  ]
})
export class ResetPasswordModule { }
