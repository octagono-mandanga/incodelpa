import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteConfiguracionComponent } from './docente-configuracion.component';

const routes: Routes = [
  { path: '', component: DocenteConfiguracionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteConfiguracionRoutingModule { }
