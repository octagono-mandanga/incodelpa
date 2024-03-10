import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootPeriodosRoutingModule } from './root-periodos-routing.module';
import { RootPeriodosComponent } from './root-periodos.component';
import { RootPeriodosAddComponent } from './root-periodos-add/root-periodos-add.component';
import { RootPeriodosEditComponent } from './root-periodos-edit/root-periodos-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootPeriodosComponent,
    RootPeriodosAddComponent,
    RootPeriodosEditComponent,
  ],
  imports: [
    CommonModule,
    RootPeriodosRoutingModule,
    SharedModule
  ]
})
export class RootPeriodosModule { }
