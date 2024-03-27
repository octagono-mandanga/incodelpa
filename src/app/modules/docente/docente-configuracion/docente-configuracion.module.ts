import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteConfiguracionRoutingModule } from './docente-configuracion-routing.module';
import { DocenteConfiguracionComponent } from './docente-configuracion.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocenteConfiguracionComponent
  ],
  imports: [
    CommonModule,
    DocenteConfiguracionRoutingModule,
    SharedModule
  ]
})
export class DocenteConfiguracionModule { }
