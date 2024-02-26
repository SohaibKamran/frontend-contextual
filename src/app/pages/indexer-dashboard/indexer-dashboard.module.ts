import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { TopWidgetsComponent } from './top-widgets/top-widgets.component';
import { MyAssignedEpisodesComponent } from './my-assigned-episodes/my-assigned-episodes.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../../theme/shared/shared.module";


@NgModule({
    declarations: [
        DashboardContainerComponent,
        TopWidgetsComponent,
        MyAssignedEpisodesComponent,
        MyTasksComponent
    ],
    imports: [
        CommonModule,
        DataTablesModule,
        SharedModule
    ]
})
export class IndexerDashboardModule { }
