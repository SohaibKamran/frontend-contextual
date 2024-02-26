import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdContainerComponent } from './ad-container/ad-container.component';
import { AdCartComponent } from './ad-cart/ad-cart.component';

const routes: Routes = [
  {
    path: '',
    component: AdContainerComponent
  },
  { path: 'ad-cart', component: AdCartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdInventoryRoutingModule { }
