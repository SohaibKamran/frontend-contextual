import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
// import { AuthModule } from './auth/auth.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegistrationSuccessComponent } from './register/registration-success/registration-success.component';
import { AnnotatorLoginComponent } from './tagger-details/annotator-login/annotator-login.component';
import { TaggerRegisterComponent } from './tagger-details/tagger-register/tagger-register/tagger-register.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OffcanvasLoginComponent } from '../theme/shared/components/offcanvas-login/offcanvas-login.component';
import { DeactiveUserModalComponent } from './login/deactive-user-modal/deactive-user-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegistrationSuccessComponent,
    AnnotatorLoginComponent,
    TaggerRegisterComponent,
    DeactiveUserModalComponent,
    
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    AccountRoutingModule,
    NgSelectModule,
    OffcanvasLoginComponent
    // AuthModule
  ]
})
export class AccountModule { }
