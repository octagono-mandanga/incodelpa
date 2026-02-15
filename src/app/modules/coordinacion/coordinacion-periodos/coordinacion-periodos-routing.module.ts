import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionPeriodosComponent } from './coordinacion-periodos.component';
import { CoordinacionPeriodosAddComponent } from './coordinacion-periodos-add/coordinacion-periodos-add.component';
import { CoordinacionPeriodosEditComponent } from './coordinacion-periodos-edit/coordinacion-periodos-edit.component';

const routes: Routes = [
  { path: '', component: CoordinacionPeriodosComponent },
  { path: 'add', component: CoordinacionPeriodosAddComponent },
  { path: 'edit/:id', component: CoordinacionPeriodosEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionPeriodosRoutingModule { }
