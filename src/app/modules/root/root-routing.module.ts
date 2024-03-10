import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { RootBackupComponent } from './root-backup/root-backup.component';
import { RootGuardService } from 'src/app/guard/root.guard';

const routes: Routes = [
  { path: '', component: RootComponent, children:
    [
      { path: '', redirectTo: 'backup', pathMatch: 'full' },
      { path: 'backup', component: RootBackupComponent },

      { path: 'perfil', loadChildren: () => import('./root-perfil/root-perfil.module').then( m => m.RootPerfilModule ) },
      { path: 'configuracion', loadChildren: () => import('./root-configuracion/root-configuracion.module').then( m => m.RootConfiguracionModule ) },

      { path: 'roles', loadChildren: () => import('./root-roles/root-roles.module').then( m => m.RootRolesModule ) },
      { path: 'lectivos', loadChildren: () => import('./root-lectivos/root-lectivos.module').then( m => m.RootLectivosModule ) },
      { path: 'periodos', loadChildren: () => import('./root-periodos/root-periodos.module').then( m => m.RootPeriodosModule ) },
      { path: 'usuarios', loadChildren: () => import('./root-usuarios/root-usuarios.module').then( m => m.RootUsuariosModule ) },
      { path: 'materias', loadChildren: () => import('./root-materias/root-materias.module').then( m => m.RootMateriasModule ) },
      { path: 'areas', loadChildren: () => import('./root-areas/root-areas.module').then( m => m.RootAreasModule ) },
      { path: 'grados', loadChildren: () => import('./root-grados/root-grados.module').then( m => m.RootGradosModule ) },
      { path: 'niveles', loadChildren: () => import('./root-niveles/root-niveles.module').then( m => m.RootNivelesModule ) },

      { path: 'institucion', loadChildren: () => import('./root-institucion/root-institucion.module').then( m => m.RootInstitucionModule ) },
      { path: 'sedes', loadChildren: () => import('./root-sedes/root-sedes.module').then( m => m.RootSedesModule ) },

    ],
    canActivate: [RootGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
