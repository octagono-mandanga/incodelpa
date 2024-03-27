import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', loadChildren: ()=> import('./modules/log/log.module').then(m => m.LogModule)},
  {path:'root', loadChildren: ()=> import('./modules/root/root.module').then(m => m.RootModule)},
  {path:'coordinacion', loadChildren: ()=> import('./modules/coordinacion/coordinacion.module').then(m => m.CoordinacionModule)},
  {path:'secretaria', loadChildren: ()=> import('./modules/secretaria/secretaria.module').then(m => m.SecretariaModule)},
  {path:'rectoria', loadChildren: ()=> import('./modules/rectoria/rectoria.module').then(m => m.RectoriaModule)},
  {path:'docente', loadChildren: ()=> import('./modules/docente/docente.module').then(m => m.DocenteModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
