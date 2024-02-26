import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaBuysComponent } from './media-buys/media-buys.component';

const routes: Routes = [
  { path: '', component: MediaBuysComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdBuysRoutingModule { }
