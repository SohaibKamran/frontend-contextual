import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchVideoRoutingModule } from './watch-video-routing.module';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideosGridComponent } from './videos-grid/videos-grid.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { MatIconModule } from '@angular/material/icon';
import { AdAlertComponent } from 'src/app/shared/ad-alert/ad-alert.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import {MatSelectModule} from '@angular/material/select';
import { SeasonDetailsComponent } from './season-details/season-details.component';
import { SortByPipe } from 'src/app/core/Pipe/orderBy.pipe';
import { EpisodeAdInventoryComponent } from 'src/app/shared/episode-ad-inventory/episode-ad-inventory.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSliderModule } from '@angular/material/slider';
import { VjsPlayerComponent } from 'src/app/shared/vjs-player/vjs-player.component';
@NgModule({
    declarations: [
        VideoPlayerComponent,
        VideosGridComponent,
        SeasonDetailsComponent,
        SortByPipe
    ],
    imports: [
        CommonModule,
        WatchVideoRoutingModule,
        SharedModule,
        CoreModule,
        MatIconModule,
        VgCoreModule,
        VgBufferingModule,
        VgOverlayPlayModule,
        VgControlsModule,
        MatSelectModule,
        AdAlertComponent,
        EpisodeAdInventoryComponent,
        NgSelectModule,
        MatSliderModule,
        VjsPlayerComponent
    ]
})
export class WatchVideoModule { }
