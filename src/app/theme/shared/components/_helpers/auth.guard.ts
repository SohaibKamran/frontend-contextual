import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLES } from 'src/app/account/register/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('token')) {
      const userRole = JSON.parse(localStorage.getItem('role'));
      if (route.data['role'] && route.data['role'] !== userRole) {
        if (userRole == ROLES.superAdmin)
          return true
        else if (userRole == ROLES.tagger && state.url.includes('user'))
          return true
        else if ((userRole == ROLES.superAdmin || userRole == ROLES.tagger) && state.url == '/')
          return this.router.navigate(['/indexer']);
        else if ((userRole == ROLES.streamer))
          return this.router.navigate(['/streamer']);
        else if ((userRole == ROLES.superAdmin || userRole == ROLES.viewer) && state.url == '/')
          return this.router.navigate(['/user']);
        else if (userRole == ROLES.tagger)
          return this.router.navigate(['/login']);
        else
          return this.router.navigate(['/auth/tagger-login']);
      }
      return true;
    }
    return this.router.navigate(['/login']);
  }
}
