import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootLectivosRoutingModule } from './root-lectivos-routing.module';
import { RootLectivosComponent } from './root-lectivos.component';
import { RootLectivosAddComponent } from './root-lectivos-add/root-lectivos-add.component';
import { RootLectivosEditComponent } from './root-lectivos-edit/root-lectivos-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootLectivosComponent,
    RootLectivosAddComponent,
    RootLectivosEditComponent
  ],
  imports: [
    CommonModule,
    RootLectivosRoutingModule,
    SharedModule
  ]
})
export class RootLectivosModule { }
