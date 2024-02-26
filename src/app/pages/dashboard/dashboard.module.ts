import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TopTaggersComponent } from './top-taggers/top-taggers.component';
import { AverageVzotScoreComponent } from './average-vzot-score/average-vzot-score.component';
import { CloudCostsComponent } from './cloud-costs/cloud-costs.component';
import { ApiControlComponent } from './api-control/api-control.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TrendingShowsComponent } from 'src/app/shared/trending-shows/trending-shows.component';
import { MostActiveUsersComponent } from 'src/app/shared/most-active-users/most-active-users.component';
import { CurrentTaggingStatusComponent } from 'src/app/shared/current-tagging-status/current-tagging-status.component';
import { ProgressBySeriesComponent } from 'src/app/shared/progress-by-series/progress-by-series.component';
import { TrendingActorsComponent } from 'src/app/shared/trending-actors/trending-actors.component';
import { TopWidgetsComponent } from 'src/app/shared/top-widgets/top-widgets.component';
import { CoreModule } from 'src/app/core/core.module';
import { AlgorithmPercentageComponent } from './algorithm-percentage/algorithm-percentage.component';

@NgModule({
  declarations: [
    DashboardContainerComponent,
    TopTaggersComponent,
    AverageVzotScoreComponent,
    CloudCostsComponent,
    ApiControlComponent,
    AlgorithmPercentageComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule, 
    SharedModule,
    NgbProgressbarModule,
    TrendingActorsComponent,
    ProgressBySeriesComponent,
    CurrentTaggingStatusComponent,
    MostActiveUsersComponent,
    TrendingShowsComponent,
    TopWidgetsComponent,
    CoreModule

  ],
  exports:[] 
})
export class DashboardModule { }
