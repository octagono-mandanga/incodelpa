import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogRoutingModule } from './log-routing.module';
import { LogComponent } from './log.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RecoverComponent } from './recover/recover.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CodeComponent } from './code/code.component';


@NgModule({
  declarations: [
    LogComponent,
    LoginComponent,
    LogoutComponent,
    RecoverComponent,
    CodeComponent
  ],
  imports: [
    CommonModule,
    LogRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LogModule { }
