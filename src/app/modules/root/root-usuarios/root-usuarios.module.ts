import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootUsuariosRoutingModule } from './root-usuarios-routing.module';
import { RootUsuariosComponent } from './root-usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RootUsuariosAddComponent } from './root-usuarios-add/root-usuarios-add.component';
import { RootUsuariosEditComponent } from './root-usuarios-edit/root-usuarios-edit.component';


@NgModule({
  declarations: [
    RootUsuariosComponent,
    RootUsuariosAddComponent,
    RootUsuariosEditComponent
  ],
  imports: [
    CommonModule,
    RootUsuariosRoutingModule,
    SharedModule
  ]
})
export class RootUsuariosModule { }
