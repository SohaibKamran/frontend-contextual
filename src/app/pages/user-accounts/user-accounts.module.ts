import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountsRoutingModule } from './user-accounts-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserAccountsContainerComponent } from './user-accounts-container/user-accounts-container/user-accounts-container.component';
import { UserRecordsComponent } from './user-records/user-records.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddEditUserDetailsComponent } from './add-edit-user-details/add-edit-user-details.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MostActiveUsersComponent } from 'src/app/shared/most-active-users/most-active-users.component';
import { ProgressBySeriesComponent } from 'src/app/shared/progress-by-series/progress-by-series.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddUserModalComponent } from 'src/app/shared/add-user-modal/add-user-modal.component';

@NgModule({
  declarations: [
    UserAccountsContainerComponent,
    UserRecordsComponent,
    UserRecordsComponent,
    AddEditUserDetailsComponent
  ],
  imports: [
    CommonModule,
    MostActiveUsersComponent,
    UserAccountsRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ProgressBySeriesComponent,
    FileUploadModule,
    NgSelectModule,
    AddUserModalComponent
  ]
})
export class UserAccountsModule { }
