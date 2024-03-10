import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootAreasRoutingModule } from './root-areas-routing.module';
import { RootAreasComponent } from './root-areas.component';
import { RootAreasAddComponent } from './root-areas-add/root-areas-add.component';
import { RootAreasEditComponent } from './root-areas-edit/root-areas-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootAreasComponent,
    RootAreasAddComponent,
    RootAreasEditComponent
  ],
  imports: [
    CommonModule,
    RootAreasRoutingModule,
    SharedModule
  ]
})
export class RootAreasModule { }
