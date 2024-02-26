import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountsContainerComponent } from './user-accounts-container/user-accounts-container/user-accounts-container.component';

const routes: Routes = [
  { path: '', component: UserAccountsContainerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountsRoutingModule { }
