import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariaComponent } from './secretaria.component';


const routes: Routes = [
  { path: '', component: SecretariaComponent, children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: 'cursos', loadChildren: () => import('./secretaria-cursos/secretaria-cursos.module').then(m => m.SecretariaCursosModule) },
      { path: 'alumnos', loadChildren: () => import('./secretaria-alumnos/secretaria-alumnos.module').then(m => m.SecretariaAlumnosModule) },
      { path: 'docentes', loadChildren: () => import('./secretaria-docentes/secretaria-docentes.module').then(m => m.SecretariaDocentesModule) },
      { path: 'reportes', loadChildren: () => import('./secretaria-reportes/secretaria-reportes.module').then(m => m.SecretariaReportesModule) },
      { path: 'perfil', loadChildren: () => import('./secretaria-perfil/secretaria-perfil.module').then(m => m.SecretariaPerfilModule) },
      { path: 'configuracion', loadChildren: () => import('./secretaria-configuracion/secretaria-configuracion.module').then(m => m.SecretariaConfiguracionModule) },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariaRoutingModule { }
