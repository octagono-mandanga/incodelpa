import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentePeriodosRoutingModule } from './docente-periodos-routing.module';
import { DocentePeriodosComponent } from './docente-periodos.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocentePeriodosComponent
  ],
  imports: [
    CommonModule,
    DocentePeriodosRoutingModule,
    SharedModule
  ]
})
export class DocentePeriodosModule { }
