import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootPerfilRoutingModule } from './root-perfil-routing.module';
import { RootPerfilComponent } from './root-perfil.component';


@NgModule({
  declarations: [
    RootPerfilComponent
  ],
  imports: [
    CommonModule,
    RootPerfilRoutingModule
  ]
})
export class RootPerfilModule { }
