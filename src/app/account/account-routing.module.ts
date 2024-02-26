import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AnnotatorLoginComponent } from './tagger-details/annotator-login/annotator-login.component';
import { RegisterComponent } from './register/register.component';
import { TaggerRegisterComponent } from './tagger-details/tagger-register/tagger-register/tagger-register.component';
import { TaggerRegisterSuccessComponent } from './tagger-details/tagger-register/tagger-register-success/tagger-register-success.component';

const routes: Routes = [
  // { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },


  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tagger-login',
    component: AnnotatorLoginComponent
  },
  {
    path: 'tagger-register',
    component: TaggerRegisterComponent
  },
  {
    path: 'register/success',
    component: TaggerRegisterSuccessComponent
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
