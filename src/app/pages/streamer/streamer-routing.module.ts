import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KeyManagementComponent } from './key-management/key-management.component';

const routes: Routes = [
   {path:'',component:DashboardComponent},
   {path:'dashboard',component:DashboardComponent},
   {path:'manage-keys',component:KeyManagementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamerRoutingModule { }
