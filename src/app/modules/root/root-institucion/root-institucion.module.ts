import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootInstitucionRoutingModule } from './root-institucion-routing.module';
import { RootInstitucionComponent } from './root-institucion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RootInstitucionFormComponent } from './root-institucion-form/root-institucion-form.component';


@NgModule({
  declarations: [
    RootInstitucionComponent,
    RootInstitucionFormComponent
  ],
  imports: [
    CommonModule,
    RootInstitucionRoutingModule,
    SharedModule
  ]
})
export class RootInstitucionModule { }
