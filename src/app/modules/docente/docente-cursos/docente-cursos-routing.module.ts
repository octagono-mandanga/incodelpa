import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteCursosComponent } from './docente-cursos.component';

const routes: Routes = [
  { path: '', component: DocenteCursosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteCursosRoutingModule { }
