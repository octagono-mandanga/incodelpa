import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteNotasExtrasRoutingModule } from './docente-notas-extras-routing.module';
import { DocenteNotasExtrasComponent } from './docente-notas-extras.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocenteNotasExtrasComponent
  ],
  imports: [
    CommonModule,
    DocenteNotasExtrasRoutingModule,
    SharedModule
  ]
})
export class DocenteNotasExtrasModule { }
