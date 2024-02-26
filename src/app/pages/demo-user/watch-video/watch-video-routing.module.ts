import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideosGridComponent } from './videos-grid/videos-grid.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [
  {path:'player', component:VideosGridComponent},
  {path:'play', component:VideoPlayerComponent},
  {path:'play/:id', component:VideoPlayerComponent},
  {path:'player/:id', component:VideoPlayerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WatchVideoRoutingModule { }
