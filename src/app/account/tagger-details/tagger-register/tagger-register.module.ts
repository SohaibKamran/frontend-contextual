import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaggerRegisterComponent } from './tagger-register/tagger-register.component';
import { TaggerRegisterSuccessComponent } from './tagger-register-success/tagger-register-success.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TaggerRegisterComponent,
    TaggerRegisterSuccessComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaggerRegisterModule { }
