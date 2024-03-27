import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocentePeriodosComponent } from './docente-periodos.component';

const routes: Routes = [
  { path: '', component: DocentePeriodosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentePeriodosRoutingModule { }
