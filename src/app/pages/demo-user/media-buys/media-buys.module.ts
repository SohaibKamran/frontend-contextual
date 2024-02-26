import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
import { AdBuysRoutingModule } from './media-buys-routing.module';
import { ModifyIntPipe } from 'src/app/core/Pipe/modify-int.pipe';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MediaBuysComponent } from './media-buys/media-buys.component';
import { RevenueCalculatorModalComponent } from './revenue-calculator-modal/modal/modal.component';
import { FilterAdvertiserPipe } from './filter-advertiser.pipe';
import { ExportPDFModalComponent } from './export-pdfmodal/export-pdfmodal.component';

@NgModule({
  declarations: [
    MediaBuysComponent,
    RevenueCalculatorModalComponent,
    FilterAdvertiserPipe,
    ExportPDFModalComponent,
  ],
  imports: [
    CommonModule,
    AdBuysRoutingModule,
    AdAlertComponent,
    ModifyIntPipe,
    SharedModule,

  ]
})
export class MyMediaBuysComponent { }
