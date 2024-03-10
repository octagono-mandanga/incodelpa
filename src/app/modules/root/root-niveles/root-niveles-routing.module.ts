import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootNivelesComponent } from './root-niveles.component';
import { RootNivelesAddComponent } from './root-niveles-add/root-niveles-add.component';
import { RootNivelesEditComponent } from './root-niveles-edit/root-niveles-edit.component';

const routes: Routes = [
  { path: '', component: RootNivelesComponent },
  { path: 'add', component: RootNivelesAddComponent },
  { path: 'edit/:id', component: RootNivelesEditComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootNivelesRoutingModule { }
