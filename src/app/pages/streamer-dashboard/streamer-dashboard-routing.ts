import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewEpisodeComponent } from '../new-tv-episode/add-new-episode/add-new-episode.component';
import { AddNewMovieComponent } from '../new-movie/add-new-movie/add-new-movie.component';
import { StreamerContainerComponent } from './streamer-container/streamer-container.component';

const routes: Routes = [
  { path: '', component: StreamerContainerComponent },
  { path: 'addNewEpisode', component: AddNewEpisodeComponent },
  { path: 'addNewMovie', component: AddNewMovieComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamerDashboardRoutingModule { }
