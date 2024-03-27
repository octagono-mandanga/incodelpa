import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteCompetenciasComponent } from './docente-competencias.component';
import { DocenteCompetenciaAsignaturasComponent } from './docente-competencia-asignaturas/docente-competencia-asignaturas.component';
import { DocenteCompetenciaAsignaturaComponent } from './docente-competencia-asignatura/docente-competencia-asignatura.component';
import { DocenteCompetenciaAsignaturaAddComponent } from './docente-competencia-asignatura-add/docente-competencia-asignatura-add.component';
import { DocenteCompetenciaAsignaturaEditComponent } from './docente-competencia-asignatura-edit/docente-competencia-asignatura-edit.component';

const routes: Routes = [
  { path: '',  component: DocenteCompetenciasComponent, children: [
    { path: '', component: DocenteCompetenciaAsignaturasComponent },
    { path: 'asignatura/:id', component: DocenteCompetenciaAsignaturaComponent },
    { path: 'asignatura-add/:id', component: DocenteCompetenciaAsignaturaAddComponent },
    { path: 'asignatura-edit/:id', component: DocenteCompetenciaAsignaturaEditComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteCompetenciasRoutingModule { }
