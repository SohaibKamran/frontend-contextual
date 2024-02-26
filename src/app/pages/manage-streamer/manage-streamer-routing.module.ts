import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageStreamerContainerComponent } from './manage-streamer-container/manage-streamer-container.component';
const routes: Routes = [
  { path: '', component: ManageStreamerContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStreamerRoutingModule { }
