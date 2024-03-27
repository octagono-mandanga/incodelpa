import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './datatable/datatable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioComponent } from './formulario/formulario.component';
import { EntityDisplayComponent } from './entity-display/entity-display.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { UserListComponent } from './user-list/user-list.component';
import { Loading2Component } from './loading2/loading2.component';
import { CursoNotasComponent } from './curso-notas/curso-notas.component';
import { AlumnoExpedienteComponent } from './alumno-expediente/alumno-expediente.component';
import { AlumnoBuscarComponent } from './alumno-buscar/alumno-buscar.component';
import { MatriculaModificarComponent } from './matricula-modificar/matricula-modificar.component';
import { ConstructionMessageComponent } from './construction-message/construction-message.component';
import { AlumnoCalificarComponent } from './alumno-calificar/alumno-calificar.component';
import { AlumnoCalificarCompetenciaComponent } from './alumno-calificar-competencia/alumno-calificar-competencia.component';
import { RoundPipe } from '../round.pipe';



@NgModule({
  declarations: [
    DatatableComponent,
    FormularioComponent,
    EntityDisplayComponent,
    LoadingComponent,
    UserListComponent,
    Loading2Component,
    CursoNotasComponent,
    AlumnoExpedienteComponent,
    AlumnoBuscarComponent,
    MatriculaModificarComponent,
    ConstructionMessageComponent,
    AlumnoCalificarComponent,
    AlumnoCalificarCompetenciaComponent,
    RoundPipe
  ],
  exports: [
    DatatableComponent,
    FormularioComponent,
    EntityDisplayComponent,
    LoadingComponent,
    Loading2Component,
    UserListComponent,
    CursoNotasComponent,
    AlumnoExpedienteComponent,
    AlumnoBuscarComponent,
    MatriculaModificarComponent,
    ConstructionMessageComponent,
    AlumnoCalificarComponent,
    RoundPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
