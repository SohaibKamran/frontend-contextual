import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewMovieRoutingModule } from './new-movie-routing.module';
import { NewMovieContainerComponent } from './new-movie-container/new-movie-container.component';
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// imports {NgMultiSelectDropDownModule}
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from 'src/app/core/core.module';
@NgModule({
  declarations: [
    NewMovieContainerComponent,
    AddNewMovieComponent
  ],
  imports: [
    CommonModule,
    NewMovieRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    CoreModule
  ]
})
export class NewMovieModule { }
