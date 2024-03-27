import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteCompetenciasRoutingModule } from './docente-competencias-routing.module';
import { DocenteCompetenciasComponent } from './docente-competencias.component';
import { DocenteCompetenciaAsignaturasComponent } from './docente-competencia-asignaturas/docente-competencia-asignaturas.component';
import { DocenteCompetenciaAsignaturaComponent } from './docente-competencia-asignatura/docente-competencia-asignatura.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DocenteCompetenciaAsignaturaAddComponent } from './docente-competencia-asignatura-add/docente-competencia-asignatura-add.component';
import { DocenteCompetenciaAsignaturaEditComponent } from './docente-competencia-asignatura-edit/docente-competencia-asignatura-edit.component';

@NgModule({
  declarations: [
    DocenteCompetenciasComponent,
    DocenteCompetenciaAsignaturasComponent,
    DocenteCompetenciaAsignaturaComponent,
    DocenteCompetenciaAsignaturaAddComponent,
    DocenteCompetenciaAsignaturaEditComponent
  ],
  imports: [
    CommonModule,
    DocenteCompetenciasRoutingModule,
    SharedModule,
    DragDropModule
  ]
})
export class DocenteCompetenciasModule { }
