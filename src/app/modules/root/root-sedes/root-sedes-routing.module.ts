import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootSedesComponent } from './root-sedes.component';
import { RootSedesAddComponent } from './root-sedes-add/root-sedes-add.component';
import { RootSedesEditComponent } from './root-sedes-edit/root-sedes-edit.component';

const routes: Routes = [
  { path: '', component: RootSedesComponent },
  { path: 'add', component: RootSedesAddComponent },
  { path: 'edit/:id', component: RootSedesEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootSedesRoutingModule { }
