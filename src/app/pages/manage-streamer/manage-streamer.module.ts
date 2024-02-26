import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditStreamerComponent } from './add-edit-streamer/add-edit-streamer.component';
import { StreamerRecordsComponent } from './streamer-records/streamer-records.component';
import { ManageStreamerContainerComponent } from './manage-streamer-container/manage-streamer-container.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LargestAdInventoriesComponent } from 'src/app/shared/largest-ad-inventories/largest-ad-inventories.component';
import { ManageStreamerRoutingModule } from './manage-streamer-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TopSuperProxyStreamerComponent } from './top-super-proxy-streamer/top-super-proxy-streamer.component';
import { TrendingAdsStreamerComponent } from './trending-ads-streamer/trending-ads-streamer.component';



@NgModule({
  declarations: [

    AddEditStreamerComponent,
    StreamerRecordsComponent,
    ManageStreamerContainerComponent,
    TopSuperProxyStreamerComponent,
    TrendingAdsStreamerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ManageStreamerRoutingModule,
    NgMultiSelectDropDownModule,
    NgxSliderModule,
    LargestAdInventoriesComponent,
    NgSelectModule
  ]
})
export class ManageStreamerModule { }
