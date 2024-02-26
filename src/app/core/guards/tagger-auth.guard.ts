import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// import { AuthenticationService } from '../services/auth.service';
// import { AuthfakeauthenticationService } from '../services/authfake.service';

import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectAnnotatorComponent } from 'src/app/shared/select-annotator-modal/select-annotator/select-annotator.component';
import { ROLES } from 'src/app/account/register/roles';

@Injectable({ providedIn: 'root' })
export class TaggerAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private modal: NgbModal
    ) { }

    canActivate(route: any, state: RouterStateSnapshot) {
        if (localStorage.getItem('token')) {
            const userRole = JSON.parse(localStorage.getItem('role'));
            if (localStorage.getItem('simulatedtaggerid') || (userRole == ROLES.tagger)) {
                return true;
            }
            else {
                const selectAnnotatorModal = this.modal.open(SelectAnnotatorComponent, {
                    windowClass: "modal-xl",
                    backdrop: "static",
                    keyboard: false,
                    centered: true,
                    size: 'sm'
                });
                selectAnnotatorModal.componentInstance.redirectUrl = route._routerState.url;
                return false;
            }
        }
        else
            return this.router.navigate(['/login']);
    }
}
