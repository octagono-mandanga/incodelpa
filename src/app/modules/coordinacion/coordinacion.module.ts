import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionRoutingModule } from './coordinacion-routing.module';
import { CoordinacionComponent } from './coordinacion.component';
import { CoordinacionUnderconstructionComponent } from './coordinacion-underconstruction/coordinacion-underconstruction.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CoordinacionComponent,
    CoordinacionUnderconstructionComponent,
  ],
  imports: [
    CommonModule,
    CoordinacionRoutingModule,
    SharedModule
  ]
})
export class CoordinacionModule { }
