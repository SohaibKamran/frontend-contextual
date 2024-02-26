import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopingContainerComponent } from './shoping-container/shoping-container.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';

const routes: Routes = [{
  path:'',component:ShopingContainerComponent,children:[
    {path:'',component:MyWishlistComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyShoppingRoutingModule { }
