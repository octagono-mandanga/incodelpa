import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootInstitucionComponent } from './root-institucion.component';
import { RootInstitucionFormComponent } from './root-institucion-form/root-institucion-form.component';

const routes: Routes = [
  { path: '', component: RootInstitucionComponent },
  { path: 'form/:id', component: RootInstitucionFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootInstitucionRoutingModule { }
