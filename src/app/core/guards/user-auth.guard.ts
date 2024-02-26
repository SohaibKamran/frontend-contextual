import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ROLES } from 'src/app/account/register/roles';
import { SelectUserComponent } from 'src/app/shared/select-user-modal/select-user/select-user.component';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private modal: NgbModal
  ) { }

  canActivate(route: any, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      const userRole = JSON.parse(localStorage.getItem('role'));
      if (localStorage.getItem('simulateduserid') || (userRole == ROLES.viewer)) {
        return true;
      }
      else {
        const selectUserModal = this.modal.open(SelectUserComponent, {
          windowClass: "modal-sm",
          backdrop: "static",
          keyboard: false,
          centered: true,
        });
        selectUserModal.componentInstance.redirectUrl = route._routerState.url;
        return false;
      }
    }
    else
      return this.router.navigate(['/login']);
  }
}
