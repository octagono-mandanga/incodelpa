import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootNivelesRoutingModule } from './root-niveles-routing.module';
import { RootNivelesComponent } from './root-niveles.component';
import { RootNivelesAddComponent } from './root-niveles-add/root-niveles-add.component';
import { RootNivelesEditComponent } from './root-niveles-edit/root-niveles-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootNivelesComponent,
    RootNivelesAddComponent,
    RootNivelesEditComponent
  ],
  imports: [
    CommonModule,
    RootNivelesRoutingModule,
    SharedModule
  ]
})
export class RootNivelesModule { }
