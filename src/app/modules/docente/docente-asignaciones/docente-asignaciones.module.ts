import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteAsignacionesRoutingModule } from './docente-asignaciones-routing.module';
import { DocenteAsignacionesComponent } from './docente-asignaciones.component';

import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocenteAsignacionesComponent
  ],
  imports: [
    CommonModule,
    DocenteAsignacionesRoutingModule,
    SharedModule
  ]
})
export class DocenteAsignacionesModule { }
