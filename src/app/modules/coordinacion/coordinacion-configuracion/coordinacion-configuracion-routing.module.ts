import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionConfiguracionComponent } from './coordinacion-configuracion.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: CoordinacionConfiguracionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    SharedModule
  ]
})
export class CoordinacionConfiguracionRoutingModule { }
