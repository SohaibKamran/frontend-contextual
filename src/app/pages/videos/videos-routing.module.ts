import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewEpisodeComponent } from '../new-tv-episode/add-new-episode/add-new-episode.component';
import { VideosContainerComponent } from './videos-container/videos-container.component';
import { AddNewMovieComponent } from '../new-movie/add-new-movie/add-new-movie.component';

const routes: Routes = [
  { path: '', component: VideosContainerComponent },
  { path: 'addNewEpisode', component: AddNewEpisodeComponent },
  { path: 'addNewMovie', component: AddNewMovieComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
