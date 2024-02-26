import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseContainerComponent } from './database-container/database-container.component';
import { DatabaseRecordsComponent } from './database-records/database-records.component';
import { DatabaseFiltersComponent } from './database-filters/database-filters.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { DatabaseDashboardComponent } from './database-dashboard/database-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TrendingShowsComponent } from 'src/app/shared/trending-shows/trending-shows.component';
import { FormsModule } from '@angular/forms';
import { TrendingActorsComponent } from 'src/app/shared/trending-actors/trending-actors.component';
import { LargestAdInventoriesComponent } from 'src/app/shared/largest-ad-inventories/largest-ad-inventories.component';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
import { TopWidgetsComponent } from 'src/app/shared/top-widgets/top-widgets.component';
import { ProgressBySeriesComponent } from 'src/app/shared/progress-by-series/progress-by-series.component';
import { CurrentTaggingStatusComponent } from 'src/app/shared/current-tagging-status/current-tagging-status.component';
import { CoreModule } from 'src/app/core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DownloadDatabaseModalComponent } from './download-database-modal/download-database-modal.component';
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

@NgModule({
  declarations: [
    DatabaseContainerComponent,
    DatabaseRecordsComponent,
    DatabaseFiltersComponent,
    DatabaseDashboardComponent,
    DownloadDatabaseModalComponent
    
  ],
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    NgMultiSelectDropDownModule,
    SharedModule,
    NgxSliderModule,
    NgApexchartsModule,
    TrendingActorsComponent,
    ProgressBySeriesComponent,
    CurrentTaggingStatusComponent,
    TrendingShowsComponent,
    TopWidgetsComponent,
    LargestAdInventoriesComponent,
    AnnotatorsFilterComponent,
    FormsModule,
    CoreModule,
    NgSelectModule,
    NotifierModule.withConfig(customNotifierOptions)
  ]
})
export class DatabaseModule { }
