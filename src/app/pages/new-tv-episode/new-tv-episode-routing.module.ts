import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewEpisodeComponent } from './add-new-episode/add-new-episode.component';

const routes: Routes = [
  {path:'',component:AddNewEpisodeComponent},
  {path:'addNewEpisode',component:AddNewEpisodeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTVEpisodeRoutingModule { }
