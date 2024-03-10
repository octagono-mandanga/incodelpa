import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootRolesRoutingModule } from './root-roles-routing.module';
import { RootRolesComponent } from './root-roles.component';
import { RootRolesAddComponent } from './root-roles-add/root-roles-add.component';
import { RootRolesEditComponent } from './root-roles-edit/root-roles-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootRolesComponent,
    RootRolesAddComponent,
    RootRolesEditComponent
  ],
  imports: [
    CommonModule,
    RootRolesRoutingModule,
    SharedModule
  ]
})
export class RootRolesModule { }
