import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootGradosRoutingModule } from './root-grados-routing.module';
import { RootGradosComponent } from './root-grados.component';
import { RootGradosAddComponent } from './root-grados-add/root-grados-add.component';
import { RootGradosEditComponent } from './root-grados-edit/root-grados-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootGradosComponent,
    RootGradosAddComponent,
    RootGradosEditComponent
  ],
  imports: [
    CommonModule,
    RootGradosRoutingModule,
    SharedModule
  ]
})
export class RootGradosModule { }
