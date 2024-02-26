import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabaseContainerComponent } from './database-container/database-container.component';
import { DatabaseDashboardComponent } from './database-dashboard/database-dashboard.component';

const routes: Routes = [
  { path: '', component: DatabaseDashboardComponent },
  { path: 'filtered', component: DatabaseContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatabaseRoutingModule { }
