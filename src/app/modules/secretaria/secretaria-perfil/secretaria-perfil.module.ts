import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaPerfilRoutingModule } from './secretaria-perfil-routing.module';
import { SecretariaPerfilComponent } from './secretaria-perfil.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SecretariaPerfilComponent
  ],
  imports: [
    CommonModule,
    SecretariaPerfilRoutingModule,
    SharedModule
  ]
})
export class SecretariaPerfilModule { }
