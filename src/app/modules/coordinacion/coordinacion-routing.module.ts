import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionComponent } from './coordinacion.component';
import { CoordinacionUnderconstructionComponent } from './coordinacion-underconstruction/coordinacion-underconstruction.component';

const routes: Routes = [
  { path: '', component: CoordinacionComponent, children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: 'cursos', loadChildren: () => import('./coordinacion-cursos/coordinacion-cursos.module').then( m => m.CoordinacionCursosModule) },
      { path: 'periodos', loadChildren: () => import('./coordinacion-periodos/coordinacion-periodos.module').then( m => m.CoordinacionPeriodosModule) },
      { path: 'alumnos', loadChildren: () => import('./coordinacion-alumnos/coordinacion-alumnos.module').then( m => m.CoordinacionAlumnosModule) },
      { path: 'docentes', loadChildren: () => import('./coordinacion-docentes/coordinacion-docentes.module').then( m => m.CoordinacionDocentesModule) },
      { path: 'habilitaciones/:id', loadChildren: () => import('./coordinacion-habilitacion/coordinacion-habilitacion.module').then( m => m.CoordinacionHabilitacionModule) },
      { path: 'perfil', loadChildren: () => import('./coordinacion-perfil/coordinacion-perfil.module').then( m => m.CoordinacionPerfilModule) },
      { path: 'configuracion', loadChildren: () => import('./coordinacion-configuracion/coordinacion-configuracion.module').then( m => m.CoordinacionConfiguracionModule) },
      { path: 'under', component: CoordinacionUnderconstructionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionRoutingModule { }
