import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaConfiguracionComponent } from './secretaria-configuracion.component';

const routes: Routes = [
  { path: '', component: SecretariaConfiguracionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaConfiguracionRoutingModule { }
