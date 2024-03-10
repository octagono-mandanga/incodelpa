import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { RootBackupComponent } from './root-backup/root-backup.component';
import { RootRolesComponent } from './root-roles/root-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RootComponent,
    RootBackupComponent
  ],
  imports: [
    CommonModule,
    RootRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class RootModule { }
