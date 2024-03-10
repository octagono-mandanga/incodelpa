import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionPerfilComponent } from './coordinacion-perfil.component';

const routes: Routes = [
  { path: '', component: CoordinacionPerfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionPerfilRoutingModule { }
