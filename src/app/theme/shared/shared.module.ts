import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { ModalModule } from './components/modal/modal.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CardComponent } from './components/card/card.component';
import { AdminAlertComponent } from './components/admin-alert/admin-alert.component';
import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import {RouterModule} from '@angular/router';

// bootstrap import
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
  NgbModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PagetitleComponent } from './components/pagetitle/pagetitle.component';
import { TaggerCanvasComponent } from './components/tagger-canvas/tagger-canvas.component';

@NgModule({
  declarations: [TaggerCanvasComponent, SpinnerComponent,PagetitleComponent, FilterModalComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    GalleryModule,
    BreadcrumbComponent,
    CardComponent,
    AdminAlertComponent,
    NgClickOutsideDirective,
    RouterModule,
    AdAlertComponent
  ],
  exports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    GalleryModule,
    SpinnerComponent,
    BreadcrumbComponent,
    CardComponent,
    AdminAlertComponent,
    NgClickOutsideDirective,
    PagetitleComponent,
    TaggerCanvasComponent
  ]
})
export class SharedModule {}
