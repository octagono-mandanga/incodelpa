import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootAreasComponent } from './root-areas.component';
import { RootAreasAddComponent } from './root-areas-add/root-areas-add.component';
import { RootAreasEditComponent } from './root-areas-edit/root-areas-edit.component';

const routes: Routes = [
  { path: '', component: RootAreasComponent },
  { path: 'add', component: RootAreasAddComponent },
  { path: 'edit/:id', component: RootAreasEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootAreasRoutingModule { }
