import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinacionComponent } from './coordinacion.component';

const routes: Routes = [
  { path: "", component: CoordinacionComponent, children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: 'cursos', loadChildren: () => import('./coordinacion-cursos/coordinacion-cursos.module').then( m => m.CoordinacionCursosModule
        ) },
      { path: 'alumnos', loadChildren: () => import('./coordinacion-alumnos/coordinacion-alumnos.module').then( m => m.CoordinacionAlumnosModule) },
      { path: 'docentes', loadChildren: () => import('./coordinacion-docentes/coordinacion-docentes.module').then( m => m.CoordinacionDocentesModule) },
      { path: 'perfil', loadChildren: () => import('./coordinacion-perfil/coordinacion-perfil.module').then( m => m.CoordinacionPerfilModule) },
      { path: 'configuracion', loadChildren: () => import('./coordinacion-configuracion/coordinacion-configuracion.module').then( m => m.CoordinacionConfiguracionModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinacionRoutingModule { }
