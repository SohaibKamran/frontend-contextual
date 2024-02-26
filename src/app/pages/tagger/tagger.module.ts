import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaggerRoutingModule } from './tagger-routing.module';
import { TaggerComponent } from './tagger.component';
import { TaggerService } from './tagger.service';
import { Routes, RouterModule } from '@angular/router';
import { VideoSelectionComponent } from './video-selection/video-selection.component';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { TempComponent } from '../temp/temp/temp.component';
import { FormsModule } from '@angular/forms';
import { ActorModalComponent } from './actor-modal/actor-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SuperDataModalComponent } from './super-data-modal/super-data-modal.component';
import { EpisodeModalComponent } from './episode-modal/episode-modal.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SceneNotesModalComponent } from './scene-notes-modal/scene-notes-modal.component';
import { SceneSubmittedModalComponent } from './scene-submitted-modal/scene-submitted-modal.component';
import { FilterScenesModalComponent } from './filter-scenes-modal/filter-scenes-modal.component';
import { ChatGptModalComponent } from './chat-gpt-modal/chat-gpt-modal.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: 'select-video',
    component: VideoSelectionComponent
  },
  {
    path: 'tag-video',
    component: TaggerComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [
    TaggerComponent,
    VideoSelectionComponent,
    ActorModalComponent,
    SuperDataModalComponent,
    EpisodeModalComponent,
    // ProfileComponent,
    SceneNotesModalComponent,
    SceneSubmittedModalComponent,
    FilterScenesModalComponent,
    ChatGptModalComponent
  ],
  imports: [
    DragDropModule,
    NgxUiLoaderModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    TaggerRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    SlickCarouselModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  providers: [TaggerService, ProfileService]
})
export class TaggerModule { }
