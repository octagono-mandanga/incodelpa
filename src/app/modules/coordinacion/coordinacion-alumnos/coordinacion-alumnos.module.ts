import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinacionAlumnosRoutingModule } from './coordinacion-alumnos-routing.module';
import { CoordinacionAlumnosComponent } from './coordinacion-alumnos.component';
import { CoordinacionAlumnosEditComponent } from './coordinacion-alumnos-edit/coordinacion-alumnos-edit.component';
import { CoordinacionAlumnosAddComponent } from './coordinacion-alumnos-add/coordinacion-alumnos-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CoordinacionAlumnosViewComponent } from './coordinacion-alumnos-view/coordinacion-alumnos-view.component';


@NgModule({
  declarations: [
    CoordinacionAlumnosComponent,
    CoordinacionAlumnosEditComponent,
    CoordinacionAlumnosAddComponent,
    CoordinacionAlumnosViewComponent
  ],
  imports: [
    CommonModule,
    CoordinacionAlumnosRoutingModule,
    ImageCropperModule,
    SharedModule
  ]
})
export class CoordinacionAlumnosModule { }
