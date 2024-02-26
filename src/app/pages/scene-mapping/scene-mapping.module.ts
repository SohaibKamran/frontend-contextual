import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneMappingComponent } from './scene-mapping/scene-mapping.component';
import { SceneMappingModuleRoutingModule } from './scene-mapping-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';



@NgModule({
  declarations: [
    SceneMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SceneMappingModuleRoutingModule
  ]
})
export class SceneMappingModule { }
