import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn, Router } from '@angular/router';
import { Observable,  of, map, catchError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service'; // Asegúrate de importar tu AuthService correctamente

@Injectable({
  providedIn: 'root'
})
export class RootGuardService {
  constructor(
    private authService: AuthService,
    private route: Router
    ) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return this.authService.checkingRole('root').pipe(
      map((response: any) => {
        const hasRole = response.hasRole;
        return hasRole;
      }),
      catchError(() => {
        // Aquí manejas el error, por ejemplo, redirigiendo al usuario
        this.route.navigate(['/logout'])
        return of(false);
      })
    );
  };
}
