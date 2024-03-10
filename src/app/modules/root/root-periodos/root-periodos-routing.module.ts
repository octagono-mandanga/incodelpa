import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootPeriodosComponent } from './root-periodos.component';
import { RootPeriodosAddComponent } from './root-periodos-add/root-periodos-add.component';
import { RootPeriodosEditComponent } from './root-periodos-edit/root-periodos-edit.component';

const routes: Routes = [
  { path: '', component: RootPeriodosComponent },
  { path: 'add', component: RootPeriodosAddComponent },
  { path: 'edit/:id', component: RootPeriodosEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootPeriodosRoutingModule { }
