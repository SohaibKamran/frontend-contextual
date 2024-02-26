import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamerRoutingModule } from './streamer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KeyManagementComponent } from './key-management/key-management.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TopWidgetsComponent } from '../indexer-dashboard/top-widgets/top-widgets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TopWidgetComponent } from './top-widget/top-widget.component';
import { FilterService } from '../dashboard/services/filter.service.';
import { TrendingSeriesComponent } from './trending-series/trending-series.component';
import { TopShowsComponent } from './top-shows/top-shows.component';
import { TopAdvertisersComponent } from './top-advertisers/top-advertisers.component';



@NgModule({
  declarations: [
    DashboardComponent,
    KeyManagementComponent,
    RevenueChartComponent,
    TopWidgetComponent,
    TrendingSeriesComponent,
    TopShowsComponent,
    TopAdvertisersComponent  ],
  imports: [
    CommonModule,
    StreamerRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ],
  providers : [FilterService]
})
export class StreamerModule { }
