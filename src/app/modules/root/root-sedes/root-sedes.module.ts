import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootSedesRoutingModule } from './root-sedes-routing.module';
import { RootSedesComponent } from './root-sedes.component';
import { RootSedesAddComponent } from './root-sedes-add/root-sedes-add.component';
import { RootSedesEditComponent } from './root-sedes-edit/root-sedes-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootSedesComponent,
    RootSedesAddComponent,
    RootSedesEditComponent
  ],
  imports: [
    CommonModule,
    RootSedesRoutingModule,
    SharedModule
  ]
})
export class RootSedesModule { }
