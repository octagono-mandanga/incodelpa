import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionPerfilRoutingModule } from './coordinacion-perfil-routing.module';
import { CoordinacionPerfilComponent } from './coordinacion-perfil.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CoordinacionPerfilComponent
  ],
  imports: [
    CommonModule,
    CoordinacionPerfilRoutingModule,
    SharedModule
  ]
})
export class CoordinacionPerfilModule { }
