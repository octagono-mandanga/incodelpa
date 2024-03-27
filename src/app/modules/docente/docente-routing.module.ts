import { DocenteComponent } from './docente.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DocenteComponent, children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full'},
      { path: 'cursos', loadChildren: () => import('./docente-asignaciones/docente-asignaciones.module').then(m => m.DocenteAsignacionesModule) },
      { path: 'cursos/:id', loadChildren: () => import('./docente-asignacion-item/docente-asignacion-item.module').then(m => m.DocenteAsignacionItemModule) },
      { path: 'calificar/:id', loadChildren: () => import('./docente-calificar/docente-calificar.module').then(m => m.DocenteCalificarModule) },
      { path: 'periodos', loadChildren: () => import('./docente-periodos/docente-periodos.module').then(m => m.DocentePeriodosModule) },
      { path: 'competencias', loadChildren: () => import('./docente-competencias/docente-competencias.module').then(m => m.DocenteCompetenciasModule) },
      { path: 'perfil', loadChildren: () => import('./docente-perfil/docente-perfil.module').then( m => m.DocentePerfilModule) },
      { path: 'configuracion', loadChildren: () => import('./docente-configuracion/docente-configuracion.module').then( m => m.DocenteConfiguracionModule) },
      { path: 'notas-extras', loadChildren: () => import('./docente-notas-extras/docente-notas-extras.module').then( m => m.DocenteNotasExtrasModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
