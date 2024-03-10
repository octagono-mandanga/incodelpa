import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionConfiguracionRoutingModule } from './coordinacion-configuracion-routing.module';
import { CoordinacionConfiguracionComponent } from './coordinacion-configuracion.component';


@NgModule({
  declarations: [
    CoordinacionConfiguracionComponent
  ],
  imports: [
    CommonModule,
    CoordinacionConfiguracionRoutingModule
  ]
})
export class CoordinacionConfiguracionModule { }
