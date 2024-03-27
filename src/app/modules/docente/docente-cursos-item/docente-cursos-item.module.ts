import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteCursosItemRoutingModule } from './docente-cursos-item-routing.module';
import { DocenteCursosItemComponent } from './docente-cursos-item.component';


@NgModule({
  declarations: [
    DocenteCursosItemComponent
  ],
  imports: [
    CommonModule,
    DocenteCursosItemRoutingModule
  ]
})
export class DocenteCursosItemModule { }
