import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentePerfilRoutingModule } from './docente-perfil-routing.module';
import { DocentePerfilComponent } from './docente-perfil.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocentePerfilComponent
  ],
  imports: [
    CommonModule,
    DocentePerfilRoutingModule,
    SharedModule
  ]
})
export class DocentePerfilModule { }
