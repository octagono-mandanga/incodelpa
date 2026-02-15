import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionCursosComponent } from './coordinacion-cursos.component';
import { CoordinacionCursosAddComponent } from './coordinacion-cursos-add/coordinacion-cursos-add.component';
import { CoordinacionCursosAsignacionComponent } from './coordinacion-cursos-asignacion/coordinacion-cursos-asignacion.component';
import { CoordinacionCursosEditComponent } from './coordinacion-cursos-edit/coordinacion-cursos-edit.component';
import { CoordinacionCursosViewComponent } from './coordinacion-cursos-view/coordinacion-cursos-view.component';
import { CoordinacionCursosAsignacionEditComponent } from './coordinacion-cursos-asignacion-edit/coordinacion-cursos-asignacion-edit.component';

const routes: Routes = [
  { path: '', component: CoordinacionCursosComponent },
  { path: 'add', component: CoordinacionCursosAddComponent },
  { path: 'edit/:id', component: CoordinacionCursosEditComponent },
  { path: 'view/:id', component: CoordinacionCursosViewComponent },
  { path: 'asignacion/:id', component: CoordinacionCursosAsignacionComponent },
  { path: 'asignacion-edit/:id', component: CoordinacionCursosAsignacionEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionCursosRoutingModule { }
