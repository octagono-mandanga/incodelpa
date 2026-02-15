import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionCursosRoutingModule } from './coordinacion-cursos-routing.module';
import { CoordinacionCursosComponent } from './coordinacion-cursos.component';
import { CoordinacionCursosAddComponent } from './coordinacion-cursos-add/coordinacion-cursos-add.component';
import { CoordinacionCursosEditComponent } from './coordinacion-cursos-edit/coordinacion-cursos-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoordinacionCursosViewComponent } from './coordinacion-cursos-view/coordinacion-cursos-view.component';
import { CoordinacionCursosAsignacionComponent } from './coordinacion-cursos-asignacion/coordinacion-cursos-asignacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoordinacionCursosAsignacionEditComponent } from './coordinacion-cursos-asignacion-edit/coordinacion-cursos-asignacion-edit.component';


@NgModule({
  declarations: [
    CoordinacionCursosComponent,
    CoordinacionCursosAddComponent,
    CoordinacionCursosEditComponent,
    CoordinacionCursosViewComponent,
    CoordinacionCursosAsignacionComponent,
    CoordinacionCursosAsignacionEditComponent
  ],
  imports: [
    CommonModule,
    CoordinacionCursosRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CoordinacionCursosModule { }
