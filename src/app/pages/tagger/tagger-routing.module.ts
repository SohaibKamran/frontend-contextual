import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaggerComponent } from './tagger.component';
import { VideoSelectionComponent } from './video-selection/video-selection.component';

const routes: Routes = [
  {
    path: 'video',component: VideoSelectionComponent
  },
  {
  path : '',
  component  : TaggerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaggerRoutingModule { }
