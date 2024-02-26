import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEmailRoutingModule } from './my-email-routing.module';
import { EmailsComponent } from './emails/emails.component';
import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
import { ModifyIntPipe } from 'src/app/core/Pipe/modify-int.pipe';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  declarations: [
    EmailsComponent
  ],
  imports: [
    CommonModule,
    MyEmailRoutingModule,
    AdAlertComponent,
    ModifyIntPipe,
    SharedModule,
    NgxMasonryModule
  ]
})
export class MyEmailModule { }
