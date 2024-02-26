import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArabicTextValidator } from './helpers/arabicTextValidator';
// old
// import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import {
//     PerfectScrollbarModule,
//     PERFECT_SCROLLBAR_CONFIG,
//     PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarNotificationComponent } from './toolbar-notification/toolbar-notification.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from './slider/slider.component';
import { CardComponent } from './card/card.component';
import { IntSearchComponent } from './int-search/int-search.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { HomeCoverComponent } from './home-cover/home-cover.component';
import { ImgSliderComponent } from './img-slider/img-slider.component';
import { AddsSliderComponent } from './ads-slider/ads-slider.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IntAutocompleteComponent } from './int-autocomplete/int-autocomplete.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SliderTaggerComponent } from './slider-tagger/slider-tagger.component';
import { CardIComponent } from './card-i/card-i.component';
import { SliderAiComponent } from './slider-ai/slider-ai.component';
import { SliderProxyComponent } from './slider-proxy/slider-proxy.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { HeaderMobComponent } from './header-mob/header-mob.component';
import { ScrollEndDirective } from './directives/scrollend.directive';


@NgModule({
  declarations: [
    ArabicTextValidator,
    // SidemenuComponent,
    ToolbarNotificationComponent,
    ToolbarComponent,
    SearchBarComponent,
    FullscreenComponent,
    UserMenuComponent,
    SliderComponent,
    CardComponent,
    IntSearchComponent,
    HomeCoverComponent,
    ImgSliderComponent,
    AddsSliderComponent,
    IntAutocompleteComponent,
    SliderTaggerComponent,
    CardIComponent,
    SliderAiComponent,
    SliderProxyComponent,
    ModalDialogComponent,
    HeaderMobComponent,
    ScrollEndDirective,
  ],
  imports: [
    CommonModule,
    // old
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
    // PerfectScrollbarModule,
    NgScrollbarModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatProgressBarModule,
    SelectDropDownModule,
    SlickCarouselModule,
    AutocompleteLibModule,
    NgbCarouselModule,
  ],
  exports: [ArabicTextValidator,
    // old
    // SidemenuComponent,
    ToolbarNotificationComponent,
    ToolbarComponent,
    SearchBarComponent,
    FullscreenComponent,
    UserMenuComponent,
    SliderComponent,
    CardComponent,
    IntSearchComponent,
    HomeCoverComponent,
    ImgSliderComponent,
    AddsSliderComponent,
    IntAutocompleteComponent,
    SliderTaggerComponent,
    CardIComponent,
    SliderAiComponent,
    SliderProxyComponent,
    ModalDialogComponent,
    ScrollEndDirective,
  ]
})
export class CoreModule { }
