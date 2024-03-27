import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteNotasExtrasComponent } from './docente-notas-extras.component';

const routes: Routes = [
  { path: '', component: DocenteNotasExtrasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteNotasExtrasRoutingModule { }
