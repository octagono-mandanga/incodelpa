import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteCalificarComponent } from './docente-calificar.component';
import { DocenteCalificarIngresarNotasComponent } from './docente-calificar-ingresar-notas/docente-calificar-ingresar-notas.component';
import { DocenteCalificarReporteComponent } from './docente-calificar-reporte/docente-calificar-reporte.component';
import { DocenteCalificarCompetenciasComponent } from './docente-calificar-competencias/docente-calificar-competencias.component';

const routes: Routes = [
  { path: '', component: DocenteCalificarComponent, children: [
      { path: '', component: DocenteCalificarCompetenciasComponent },
      { path: 'notas/:id', component: DocenteCalificarIngresarNotasComponent },
      { path: 'reporte/:id', component: DocenteCalificarReporteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteCalificarRoutingModule { }
