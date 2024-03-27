import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteAsignacionItemRoutingModule } from './docente-asignacion-item-routing.module';
import { DocenteAsignacionItemComponent } from './docente-asignacion-item.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DocenteAsignacionItemComponent
  ],
  imports: [
    CommonModule,
    DocenteAsignacionItemRoutingModule,
    SharedModule
  ]
})
export class DocenteAsignacionItemModule { }
