import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootRolesComponent } from './root-roles.component';
import { RootRolesAddComponent } from './root-roles-add/root-roles-add.component';
import { RootRolesEditComponent } from './root-roles-edit/root-roles-edit.component';

const routes: Routes = [
  { path: '', component: RootRolesComponent },
  { path: 'add', component: RootRolesAddComponent },
  { path: 'edit/:id', component: RootRolesEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRolesRoutingModule { }
