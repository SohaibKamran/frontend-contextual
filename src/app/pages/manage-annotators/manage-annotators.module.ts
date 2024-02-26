import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAnnotatorsRoutingModule } from './manage-annotators-routing.module';
import { AnnotatorRecordsComponent } from './annotator-records/annotator-records.component';
import { ManageAnnotatorsContainerComponent } from './manage-annotators-container/manage-annotators-container.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddEditAnnotatorComponent } from './add-edit-annotator/add-edit-annotator.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProgressBySeriesComponent } from 'src/app/shared/progress-by-series/progress-by-series.component';
import { CurrentTaggingStatusComponent } from 'src/app/shared/current-tagging-status/current-tagging-status.component';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    AnnotatorRecordsComponent,
    ManageAnnotatorsContainerComponent,
    AddEditAnnotatorComponent,
    
    
    
  ],
  imports: [
    CommonModule,
    ManageAnnotatorsRoutingModule,
    SharedModule,
    NgApexchartsModule, 
    NgMultiSelectDropDownModule,
    NgxSliderModule,
    ProgressBySeriesComponent,
    CurrentTaggingStatusComponent,
    AnnotatorsFilterComponent,
    NgSelectModule

  ]
})
export class ManageAnnotatorsModule { }
