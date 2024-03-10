import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaConfiguracionRoutingModule } from './secretaria-configuracion-routing.module';
import { SecretariaConfiguracionComponent } from './secretaria-configuracion.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SecretariaConfiguracionComponent
  ],
  imports: [
    CommonModule,
    SecretariaConfiguracionRoutingModule,
    SharedModule
  ]
})
export class SecretariaConfiguracionModule { }
