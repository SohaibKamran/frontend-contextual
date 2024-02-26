import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneMappingComponent } from './scene-mapping/scene-mapping.component';

const routes: Routes = [
  {path : "", component: SceneMappingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SceneMappingModuleRoutingModule { }
