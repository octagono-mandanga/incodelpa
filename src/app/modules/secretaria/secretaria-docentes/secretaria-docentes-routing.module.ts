import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaDocentesComponent } from './secretaria-docentes.component';
import { SecretariaDocentesViewComponent } from './secretaria-docentes-view/secretaria-docentes-view.component';

const routes: Routes = [
  { path: '', component: SecretariaDocentesComponent },
  { path: 'view/:id', component: SecretariaDocentesViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaDocentesRoutingModule { }
