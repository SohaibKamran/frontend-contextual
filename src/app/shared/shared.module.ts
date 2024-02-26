import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TaggerCanvasComponent } from '../theme/shared/components/tagger-canvas/tagger-canvas.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrendingRetailersComponent } from './trending-retailers/trending-retailers.component';
import { ProductTagInfoComponent } from './product-tag-info/product-tag-info.component';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    // TaggerCanvasComponent
  

  ],
  imports: [
    CommonModule,
    DragDropModule,
    CoreModule,
    VjsPlayerComponent,
    TrendingRetailersComponent,
    ProductTagInfoComponent,
    ],
  exports:[]
})
export class SharedModule { }
