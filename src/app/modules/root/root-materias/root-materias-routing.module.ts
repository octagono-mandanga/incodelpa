import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootMateriasComponent } from './root-materias.component';
import { RootMateriasAddComponent } from './root-materias-add/root-materias-add.component';
import { RootMateriasEditComponent } from './root-materias-edit/root-materias-edit.component';

const routes: Routes = [
  { path: '', component: RootMateriasComponent },
  { path: 'add', component: RootMateriasAddComponent },
  { path: 'edit/:id', component: RootMateriasEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootMateriasRoutingModule { }
