import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewTVEpisodeRoutingModule } from './new-tv-episode-routing.module';
import { AddNewEpisodeComponent } from './add-new-episode/add-new-episode.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEpisodesContainerComponent } from './new-episodes-container/new-episodes-container.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UploaderModule } from 'angular-uploader';
import { NotifierModule } from 'angular-notifier';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CoreModule } from 'src/app/core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    AddNewEpisodeComponent,
    NewEpisodesContainerComponent
  ],
  imports: [
    CommonModule,
    NewTVEpisodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    SharedModule,
    UploaderModule,
    NotifierModule,
    NgMultiSelectDropDownModule,
    CoreModule,
    NgSelectModule
  ]
})
export class NewTVEpisodeModule { }
