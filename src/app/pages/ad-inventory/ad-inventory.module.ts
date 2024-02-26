import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdInventoryRoutingModule } from './ad-inventory-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AdContainerComponent } from './ad-container/ad-container.component';
import { AdStatsComponent } from './ad-stats/ad-stats.component';
import { AdTableComponent } from './ad-table/ad-table.component';
import { AdCartComponent } from './ad-cart/ad-cart.component';
import { AdAlertComponent } from '../../shared/ad-alert/ad-alert.component';


@NgModule({
  declarations: [
    AdContainerComponent,
    AdStatsComponent,
    AdTableComponent,
    AdCartComponent,
  ],
  imports: [
    CommonModule,
    AdInventoryRoutingModule,
    SharedModule,
    AdAlertComponent,

  ]
})
export class AdInventoryModule { }
