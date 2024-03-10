import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionDocentesRoutingModule } from './coordinacion-docentes-routing.module';
import { CoordinacionDocentesComponent } from './coordinacion-docentes.component';
import { CoordinacionDocentesAddComponent } from './coordinacion-docentes-add/coordinacion-docentes-add.component';
import { CoordinacionDocentesEditComponent } from './coordinacion-docentes-edit/coordinacion-docentes-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CoordinacionDocentesComponent,
    CoordinacionDocentesAddComponent,
    CoordinacionDocentesEditComponent
  ],
  imports: [
    CommonModule,
    CoordinacionDocentesRoutingModule,
    SharedModule
  ]
})
export class CoordinacionDocentesModule { }
