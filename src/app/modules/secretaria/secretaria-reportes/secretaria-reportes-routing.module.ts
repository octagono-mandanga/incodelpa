import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaReportesComponent } from './secretaria-reportes.component';

const routes: Routes = [
  { path: '', component: SecretariaReportesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaReportesRoutingModule { }
