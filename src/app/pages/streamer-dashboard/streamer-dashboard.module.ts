import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ToastrModule } from 'ngx-toastr';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import { PercentagePipe } from 'src/app/core/Pipe/percentage.pipe';
import { ProductTagInfoComponent } from 'src/app/shared/product-tag-info/product-tag-info.component';
import { StreamerDetailsComponent } from './streamer-details/streamer-details.component';
import { StreamerContainerComponent } from './streamer-container/streamer-container.component';
import { StreamerTableComponent } from './streamer-table/streamer-table.component';
import { StreamerTopWidgetComponent } from './streamer-top-widget/streamer-top-widget.component';
import { TagSummaryComponent } from './tag-summary/tag-summary.component';
import { ActorsComponent } from './actors/actors.component';
import { FilterAdvertisersComponent } from './filter-advertisers/filter-advertisers.component';
import { ProductRecordModalComponent } from './product-record-modal/product-record-modal.component';
import { SelectAdvertisersComponent } from './select-advertisers/select-advertisers.component';
import { StreamerDashboardRoutingModule } from './streamer-dashboard-routing';
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.ballSpinClockwise, // background spinner type
  fgsType: SPINNER.chasingDots, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};


@NgModule({
  declarations: [
    StreamerDetailsComponent,
    StreamerContainerComponent,
    StreamerTableComponent,
    StreamerTopWidgetComponent,
    TagSummaryComponent,
    SelectAdvertisersComponent,
    FilterAdvertisersComponent,
    ProductRecordModalComponent,
    ActorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ProductTagInfoComponent,
    FileUploadModule,
    StreamerDashboardRoutingModule,
    NgApexchartsModule,
    SharedModule,
    NgxSliderModule,
    NgbPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbProgressbarModule,
    AnnotatorsFilterComponent,
    CoreModule,
    NgSelectModule,
    PercentagePipe,
    NotifierModule.withConfig(customNotifierOptions),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatSlideToggleModule,
  ]
})
export class StreamerDashboardModule { }
