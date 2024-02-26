import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component';
import { NewMovieContainerComponent } from './new-movie-container/new-movie-container.component';

const routes: Routes = [
  {path:'', component: NewMovieContainerComponent},
  {path:'addNewMovie', component: AddNewMovieComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMovieRoutingModule { }
