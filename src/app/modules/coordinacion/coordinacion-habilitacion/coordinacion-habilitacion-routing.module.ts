import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionHabilitacionComponent } from './coordinacion-habilitacion.component';

const routes: Routes = [
   { path: '', component: CoordinacionHabilitacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionHabilitacionRoutingModule { }
