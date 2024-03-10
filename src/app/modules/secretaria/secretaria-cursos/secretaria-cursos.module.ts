import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariaCursosRoutingModule } from './secretaria-cursos-routing.module';
import { SecretariaCursosComponent } from './secretaria-cursos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecretariaCursosViewComponent } from './secretaria-cursos-view/secretaria-cursos-view.component';
import { SecretariaCursosMatricularComponent } from './secretaria-cursos-matricular/secretaria-cursos-matricular.component';
import { SecretariaCursosRegistroAlumnoComponent } from './secretaria-cursos-registro-alumno/secretaria-cursos-registro-alumno.component';


@NgModule({
  declarations: [
    SecretariaCursosComponent,
    SecretariaCursosViewComponent,
    SecretariaCursosMatricularComponent,
    SecretariaCursosRegistroAlumnoComponent
  ],
  imports: [
    CommonModule,
    SecretariaCursosRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SecretariaCursosModule { }
