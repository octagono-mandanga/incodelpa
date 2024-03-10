import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RectoriaRoutingModule } from './rectoria-routing.module';
import { RectoriaComponent } from './rectoria.component';


@NgModule({
  declarations: [
    RectoriaComponent
  ],
  imports: [
    CommonModule,
    RectoriaRoutingModule
  ]
})
export class RectoriaModule { }
