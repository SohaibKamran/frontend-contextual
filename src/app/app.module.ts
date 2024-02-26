// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { SharedModule } from './theme/shared/shared.module';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/helpers/authInterceptor';
// import { VideoSeriesDetailsComponent } from './pages/videos/video-series-details/video-series-details.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { AddEditTaggerDetailsComponent } from './pages/add-edit-tagger-details/add-edit-tagger-details.component';
// import { SelectAdvertisersComponent } from './pages/videos/select-advertisers/select-advertisers.component';
// import { VideosFilterComponent } from './pages/videos-filter/videos-filter.component';
// import { NgxSliderModule } from '@angular-slider/ngx-slider';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TagSummaryComponent } from './pages/videos/tag-summary/tag-summary.component';
import { EpisodePreviewComponent } from './pages/episode-preview/episode-preview.component';

//videogular
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from './core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ToastrModule } from 'ngx-toastr';
import { VjsPlayerComponent } from './shared/vjs-player/vjs-player.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MediaBuysModalComponent } from './pages/demo-user/media-buys/media-buys-modal/media-buys-modal.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavItemComponent,
    NavGroupComponent,
    NavCollapseComponent,
    // VideoSeriesDetailsComponent,
    AddEditTaggerDetailsComponent,
    // SelectAdvertisersComponent,
    // VideosFilterComponent,
    // TagSummaryComponent,
    EpisodePreviewComponent,
    
  ],
  providers: [NavigationItem, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule, 
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    HttpClientModule, 
    FileUploadModule, 
    // NgxSliderModule,
    // NgMultiSelectDropDownModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgBufferingModule,
    VgOverlayPlayModule,
    MatIconModule,
    VjsPlayerComponent,
    CoreModule,
    NgxSliderModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
  ]
})
export class AppModule {}
