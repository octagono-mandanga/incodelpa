import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocentePerfilComponent } from './docente-perfil.component';

const routes: Routes = [
  { path: '', component: DocentePerfilComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentePerfilRoutingModule { }
