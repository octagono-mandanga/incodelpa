import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootConfiguracionComponent } from './root-configuracion.component';

const routes: Routes = [
  { path: '', component: RootConfiguracionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootConfiguracionRoutingModule { }
