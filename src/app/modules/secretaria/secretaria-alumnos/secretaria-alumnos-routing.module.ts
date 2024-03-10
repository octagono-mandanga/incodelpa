import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaAlumnosComponent } from './secretaria-alumnos.component';
import { SecretariaAlumnosViewComponent } from './secretaria-alumnos-view/secretaria-alumnos-view.component';
import { SecretariaAlumnosEditComponent } from './secretaria-alumnos-edit/secretaria-alumnos-edit.component';
import { SecretariaAlumnosModifyComponent } from './secretaria-alumnos-modify/secretaria-alumnos-modify.component';

const routes: Routes = [
  { path: '', component: SecretariaAlumnosComponent },
  { path: 'view/:id', component: SecretariaAlumnosViewComponent },
  { path: 'edit/:id', component: SecretariaAlumnosEditComponent },
  { path: 'modify/:id', component: SecretariaAlumnosModifyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaAlumnosRoutingModule { }
