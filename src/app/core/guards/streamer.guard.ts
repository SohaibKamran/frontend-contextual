import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLES } from 'src/app/account/register/roles';

@Injectable({
  providedIn: 'root'
})
export class StreamerGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('token')) {
        const userRole = JSON.parse(localStorage.getItem('role'));
          if (userRole == ROLES.streamer)
            return true
          else{
            return this.router.navigate(['/']);
          }
      }else{
        return this.router.navigate(['/login']);
      }
  }

}
