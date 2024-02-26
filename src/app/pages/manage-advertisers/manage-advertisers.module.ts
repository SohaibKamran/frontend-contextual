import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ManageAdvertisersRoutingModule } from './manage-advertisers-routing.module';
import { TopSuperProxiesComponent } from './top-super-proxies/top-super-proxies.component';
import { TrendingAdsComponent } from './trending-ads/trending-ads.component';
import { ManageAdvertisersContainerComponent } from './manage-advertisers-container/manage-advertisers-container.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdvertiserRecordsComponent } from './advertiser-records/advertiser-records.component';
import { AddEditAdvertiserComponent } from './add-edit-advertiser/add-edit-advertiser.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LargestAdInventoriesComponent } from 'src/app/shared/largest-ad-inventories/largest-ad-inventories.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    TopSuperProxiesComponent,
    TrendingAdsComponent,
    ManageAdvertisersContainerComponent,
    AdvertiserRecordsComponent,
    AddEditAdvertiserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ManageAdvertisersRoutingModule,
    NgMultiSelectDropDownModule,
    NgxSliderModule,
    LargestAdInventoriesComponent,
    NgSelectModule
  ]
})
export class ManageAdvertisersModule { }
