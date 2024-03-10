import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionRoutingModule } from './coordinacion-routing.module';
import { CoordinacionComponent } from './coordinacion.component';



@NgModule({
  declarations: [
    CoordinacionComponent,
  ],
  imports: [
    CommonModule,
    CoordinacionRoutingModule
  ]
})
export class CoordinacionModule { }
