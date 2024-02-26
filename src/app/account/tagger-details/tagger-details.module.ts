import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotatorLoginComponent } from './annotator-login/annotator-login.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AnnotatorLoginComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaggerDetailsModule { }
