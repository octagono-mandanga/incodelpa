import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaReportesRoutingModule } from './secretaria-reportes-routing.module';
import { SecretariaReportesComponent } from './secretaria-reportes.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SecretariaReportesComponent
  ],
  imports: [
    CommonModule,
    SecretariaReportesRoutingModule,
    SharedModule
  ]
})
export class SecretariaReportesModule { }
