import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaAlumnosRoutingModule } from './secretaria-alumnos-routing.module';
import { SecretariaAlumnosComponent } from './secretaria-alumnos.component';
import { SecretariaAlumnosViewComponent } from './secretaria-alumnos-view/secretaria-alumnos-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecretariaAlumnosEditComponent } from './secretaria-alumnos-edit/secretaria-alumnos-edit.component';
import { SecretariaAlumnosModifyComponent } from './secretaria-alumnos-modify/secretaria-alumnos-modify.component';


@NgModule({
  declarations: [
    SecretariaAlumnosComponent,
    SecretariaAlumnosViewComponent,
    SecretariaAlumnosEditComponent,
    SecretariaAlumnosModifyComponent
  ],
  imports: [
    CommonModule,
    SecretariaAlumnosRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SecretariaAlumnosModule { }
