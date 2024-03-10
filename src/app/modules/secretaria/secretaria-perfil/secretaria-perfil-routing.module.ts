import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaPerfilComponent } from './secretaria-perfil.component';

const routes: Routes = [
  { path: '', component: SecretariaPerfilComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaPerfilRoutingModule { }
