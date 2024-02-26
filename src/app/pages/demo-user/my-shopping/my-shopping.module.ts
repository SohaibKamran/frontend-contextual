import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMasonryModule } from 'ngx-masonry';

import { MyShoppingRoutingModule } from './my-shopping-routing.module';
import { ShopingContainerComponent } from './shoping-container/shoping-container.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { FavActorsComponent } from './fav-actors/fav-actors.component';
import { FavShowsComponent } from './fav-shows/fav-shows.component';
import { FavBrandsComponent } from './fav-brands/fav-brands.component';
import { TrendingBarComponent } from './trending-bar/trending-bar.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TrendingActorsComponent } from 'src/app/shared/trending-actors/trending-actors.component';
import { TrendingShowsComponent } from 'src/app/shared/trending-shows/trending-shows.component';
import { TrendingRetailersComponent } from 'src/app/shared/trending-retailers/trending-retailers.component';
import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
import { ModifyIntPipe } from 'src/app/core/Pipe/modify-int.pipe';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WishlistDataComponent } from './wishlist-data/wishlist-data.component';
import { ExploreComponent } from './explore/explore.component';
import { ExploreDataComponent } from './explore-data/explore-data.component';
@NgModule({
  declarations: [
    ShopingContainerComponent,
    MyWishlistComponent,
    FavActorsComponent,
    FavShowsComponent,
    FavBrandsComponent,
    TrendingBarComponent,
    WishlistDataComponent,
    ExploreComponent,
    ExploreDataComponent,
  ],
  imports: [
    CommonModule,
    MyShoppingRoutingModule,
    SharedModule,
    TrendingActorsComponent,
    TrendingShowsComponent,
    TrendingRetailersComponent,
    AdAlertComponent,
    ModifyIntPipe,
    NgxMasonryModule
  
  ],
  providers:[NgbNav]
})
export class MyShoppingModule { }
