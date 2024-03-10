import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootGradosComponent } from './root-grados.component';
import { RootGradosAddComponent } from './root-grados-add/root-grados-add.component';
import { RootGradosEditComponent } from './root-grados-edit/root-grados-edit.component';

const routes: Routes = [
  { path: '', component: RootGradosComponent },
  { path: 'add', component: RootGradosAddComponent },
  { path: 'edit/:id', component: RootGradosEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootGradosRoutingModule { }
