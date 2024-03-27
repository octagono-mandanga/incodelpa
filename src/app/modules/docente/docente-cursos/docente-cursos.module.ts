import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteCursosRoutingModule } from './docente-cursos-routing.module';
import { DocenteCursosComponent } from './docente-cursos.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocenteCursosComponent
  ],
  imports: [
    CommonModule,
    DocenteCursosRoutingModule,
    SharedModule
  ]
})
export class DocenteCursosModule { }
