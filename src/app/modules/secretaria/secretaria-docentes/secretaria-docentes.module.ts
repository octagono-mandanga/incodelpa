import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaDocentesRoutingModule } from './secretaria-docentes-routing.module';
import { SecretariaDocentesComponent } from './secretaria-docentes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecretariaDocentesViewComponent } from './secretaria-docentes-view/secretaria-docentes-view.component';


@NgModule({
  declarations: [
    SecretariaDocentesComponent,
    SecretariaDocentesViewComponent
  ],
  imports: [
    CommonModule,
    SecretariaDocentesRoutingModule,
    SharedModule
  ]
})
export class SecretariaDocentesModule { }
