import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionHabilitacionRoutingModule } from './coordinacion-habilitacion-routing.module';
import { CoordinacionHabilitacionComponent } from './coordinacion-habilitacion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CoordinacionHabilitacionItemComponent } from './coordinacion-habilitacion-item/coordinacion-habilitacion-item.component';


@NgModule({
  declarations: [
    CoordinacionHabilitacionComponent,
    CoordinacionHabilitacionItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CoordinacionHabilitacionRoutingModule
  ]
})
export class CoordinacionHabilitacionModule { }
