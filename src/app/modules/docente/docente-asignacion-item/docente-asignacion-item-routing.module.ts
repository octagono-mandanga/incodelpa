import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteAsignacionItemComponent } from './docente-asignacion-item.component';

const routes: Routes = [
  { path: '', component: DocenteAsignacionItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteAsignacionItemRoutingModule { }
