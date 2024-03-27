import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteRoutingModule } from './docente-routing.module';
import { DocenteComponent } from './docente.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocenteComponent
  ],
  imports: [
    CommonModule,
    DocenteRoutingModule,
    SharedModule
  ]
})
export class DocenteModule { }
