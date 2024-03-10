import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootLectivosComponent } from './root-lectivos.component';
import { RootLectivosAddComponent } from './root-lectivos-add/root-lectivos-add.component';
import { RootLectivosEditComponent } from './root-lectivos-edit/root-lectivos-edit.component';

const routes: Routes = [
  { path: '', component: RootLectivosComponent },
  { path: 'add', component: RootLectivosAddComponent },
  { path: 'edit/:id', component: RootLectivosEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootLectivosRoutingModule { }
