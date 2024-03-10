import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootMateriasRoutingModule } from './root-materias-routing.module';
import { RootMateriasComponent } from './root-materias.component';
import { RootMateriasAddComponent } from './root-materias-add/root-materias-add.component';
import { RootMateriasEditComponent } from './root-materias-edit/root-materias-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootMateriasComponent,
    RootMateriasAddComponent,
    RootMateriasEditComponent
  ],
  imports: [
    CommonModule,
    RootMateriasRoutingModule,
    SharedModule
  ]
})
export class RootMateriasModule { }
