import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteAsignacionesComponent } from './docente-asignaciones.component';

const routes: Routes = [
  { path: '', component: DocenteAsignacionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteAsignacionesRoutingModule { }
