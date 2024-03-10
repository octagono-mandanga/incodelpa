import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionAlumnosComponent } from './coordinacion-alumnos.component';
import { CoordinacionAlumnosAddComponent } from './coordinacion-alumnos-add/coordinacion-alumnos-add.component';
import { CoordinacionAlumnosEditComponent } from './coordinacion-alumnos-edit/coordinacion-alumnos-edit.component';

const routes: Routes = [
  { path: '', component: CoordinacionAlumnosComponent },
  { path: 'add', component: CoordinacionAlumnosAddComponent },
  { path: 'edit/:id', component: CoordinacionAlumnosEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionAlumnosRoutingModule { }
