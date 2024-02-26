import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAnnotatorsContainerComponent } from './manage-annotators-container/manage-annotators-container.component';

const routes: Routes = [
  { path: '', component: ManageAnnotatorsContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAnnotatorsRoutingModule { }
