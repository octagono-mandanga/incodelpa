import { CoordinacionDocentesEditComponent } from './coordinacion-docentes-edit/coordinacion-docentes-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionDocentesComponent } from './coordinacion-docentes.component';
import { CoordinacionDocentesAddComponent } from './coordinacion-docentes-add/coordinacion-docentes-add.component';

const routes: Routes = [
  { path: '', component: CoordinacionDocentesComponent },
  { path: 'add', component: CoordinacionDocentesAddComponent },
  { path: 'edit/:id', component: CoordinacionDocentesEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionDocentesRoutingModule { }
