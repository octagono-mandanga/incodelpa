import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootConfiguracionRoutingModule } from './root-configuracion-routing.module';
import { RootConfiguracionComponent } from './root-configuracion.component';


@NgModule({
  declarations: [
    RootConfiguracionComponent
  ],
  imports: [
    CommonModule,
    RootConfiguracionRoutingModule
  ]
})
export class RootConfiguracionModule { }
