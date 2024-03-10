import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaCursosComponent } from './secretaria-cursos.component';
import { SecretariaCursosViewComponent } from './secretaria-cursos-view/secretaria-cursos-view.component';
import { SecretariaCursosMatricularComponent } from './secretaria-cursos-matricular/secretaria-cursos-matricular.component';
import { SecretariaCursosRegistroAlumnoComponent } from './secretaria-cursos-registro-alumno/secretaria-cursos-registro-alumno.component';

const routes: Routes = [
  { path: '', component: SecretariaCursosComponent },
  { path: 'view/:id', component: SecretariaCursosViewComponent },
  { path: 'matricular/:id', component: SecretariaCursosMatricularComponent },
  { path: 'regalumno/:id', component: SecretariaCursosRegistroAlumnoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaCursosRoutingModule { }
