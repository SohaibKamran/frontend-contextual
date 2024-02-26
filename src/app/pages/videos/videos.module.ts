import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { VideosRoutingModule } from './videos-routing.module';
import { VideosTopWidgetComponent } from './videos-top-widget/videos-top-widget.component';
import { VideosContainerComponent } from './videos-container/videos-container.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { VideosTableComponent } from './videos-table/videos-table.component';
import { TagSummaryComponent } from './tag-summary/tag-summary.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectAdvertisersComponent } from './select-advertisers/select-advertisers.component';
import { FilterAdvertisersComponent } from './filter-advertisers/filter-advertisers.component';
import { NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoSeriesDetailsComponent } from './video-series-details/video-series-details.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ProductRecordModalComponent } from './product-record-modal/product-record-modal.component';
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
import { ActorsComponent } from './actors/actors.component';

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
    VideosTopWidgetComponent,
    VideosContainerComponent,
    VideosTableComponent,
    TagSummaryComponent,
    SelectAdvertisersComponent,
    FilterAdvertisersComponent,
    VideoSeriesDetailsComponent,
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
    VideosRoutingModule,
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
export class VideosModule { }
