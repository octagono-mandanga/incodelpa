import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaRoutingModule } from './secretaria-routing.module';
import { SecretariaComponent } from './secretaria.component';


@NgModule({
  declarations: [
    SecretariaComponent
  ],
  imports: [
    CommonModule,
    SecretariaRoutingModule
  ]
})
export class SecretariaModule { }
