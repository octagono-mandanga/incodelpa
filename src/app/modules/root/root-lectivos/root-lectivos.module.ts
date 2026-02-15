import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootLectivosRoutingModule } from './root-lectivos-routing.module';
import { RootLectivosComponent } from './root-lectivos.component';
import { RootLectivosAddComponent } from './root-lectivos-add/root-lectivos-add.component';
import { RootLectivosEditComponent } from './root-lectivos-edit/root-lectivos-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RootLectivosViewComponent } from './root-lectivos-view/root-lectivos-view.component';


@NgModule({
  declarations: [
    RootLectivosComponent,
    RootLectivosAddComponent,
    RootLectivosEditComponent,
    RootLectivosViewComponent
  ],
  imports: [
    CommonModule,
    RootLectivosRoutingModule,
    SharedModule
  ]
})
export class RootLectivosModule { }
