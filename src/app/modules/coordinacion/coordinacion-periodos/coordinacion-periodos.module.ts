import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionPeriodosRoutingModule } from './coordinacion-periodos-routing.module';
import { CoordinacionPeriodosComponent } from './coordinacion-periodos.component';
import { CoordinacionPeriodosAddComponent } from './coordinacion-periodos-add/coordinacion-periodos-add.component';
import { CoordinacionPeriodosEditComponent } from './coordinacion-periodos-edit/coordinacion-periodos-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CoordinacionPeriodosComponent,
    CoordinacionPeriodosAddComponent,
    CoordinacionPeriodosEditComponent
  ],
  imports: [
    CommonModule,
    CoordinacionPeriodosRoutingModule,
    SharedModule
  ]
})
export class CoordinacionPeriodosModule { }
