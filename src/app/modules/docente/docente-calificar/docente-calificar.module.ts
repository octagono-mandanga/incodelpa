import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteCalificarRoutingModule } from './docente-calificar-routing.module';
import { DocenteCalificarComponent } from './docente-calificar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocenteCalificarCompetenciasComponent } from './docente-calificar-competencias/docente-calificar-competencias.component';
import { DocenteCalificarIngresarNotasComponent } from './docente-calificar-ingresar-notas/docente-calificar-ingresar-notas.component';
import { DocenteCalificarReporteComponent } from './docente-calificar-reporte/docente-calificar-reporte.component';


@NgModule({
  declarations: [
    DocenteCalificarComponent,
    DocenteCalificarCompetenciasComponent,
    DocenteCalificarIngresarNotasComponent,
    DocenteCalificarReporteComponent
  ],
  imports: [
    CommonModule,
    DocenteCalificarRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DocenteCalificarModule { }
