import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAdvertisersContainerComponent } from './manage-advertisers-container/manage-advertisers-container.component';

const routes: Routes = [
  { path: '', component: ManageAdvertisersContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdvertisersRoutingModule { }
