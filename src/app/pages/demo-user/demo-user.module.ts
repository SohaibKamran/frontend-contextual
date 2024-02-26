import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoUserRoutingModule } from './demo-user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    DemoUserRoutingModule,
    SharedModule,
    AdAlertComponent
  ]
})
export class DemoUserModule { }
