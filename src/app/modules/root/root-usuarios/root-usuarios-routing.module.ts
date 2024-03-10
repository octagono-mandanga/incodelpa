import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootUsuariosComponent } from './root-usuarios.component';
import { RootUsuariosAddComponent } from './root-usuarios-add/root-usuarios-add.component';
import { RootUsuariosEditComponent } from './root-usuarios-edit/root-usuarios-edit.component';

const routes: Routes = [
  { path: '', component: RootUsuariosComponent },
  { path: 'add/:id', component: RootUsuariosAddComponent },
  { path: 'edit/:id', component: RootUsuariosEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootUsuariosRoutingModule { }
