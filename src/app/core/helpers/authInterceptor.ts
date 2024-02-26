import { Injectable, Type } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
// import { CommonStore } from "../store/common.store";
import { DisableLoaderCalls, DisableNotification } from './bypassRequests';
import { CommonStore } from '../services/common.store';
import { isString } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ToastrService } from 'ngx-toastr';
import { ROLES } from 'src/app/account/register/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NzMessageService } from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private commonStore: CommonStore,
    public modalService: NgbModal,
    private toastrService: ToastrService) // private message: NzMessageService
  { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ifDisableLoader = DisableLoaderCalls.some((x) => request.urlWithParams.match(x));
    if (!ifDisableLoader) {
      this.commonStore.loaderStart();
    }

    if (request.urlWithParams.match(/login$/) || request.urlWithParams.match(/.json$/)) {
      return next.handle(request).pipe(
        tap((evt: any) => {
          if (evt.body && evt.body.message) {
            this.commonStore.loaderEnd();
          }
        }),
        catchError((error) => {
          this.commonStore.loaderEnd();
          if (error.statusText == 'Unknown Error') {
            // this.router.navigateByUrl('/full/error-2');
            this.commonStore.notifier({ action: 'error', message: 'There is something wrong with server' });
          }
          this.commonStore.notifier({ action: 'error', message: error.error?.message || error.message || 'Error Occured' });

          this.toastrService.error(error.error.message, "Error!")
          throw error;
        })
      );
    } else {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const simulateduserid = localStorage.getItem('simulateduserid')
      const simulatedtaggerid = localStorage.getItem('simulatedtaggerid')
      const role = JSON.parse(localStorage.getItem('role'));
      if (request.url.includes('https://www.googleapis.com')) return next.handle(request);
      let headers = request.headers.set('Authorization', 'Bearer ' + token);
      if (simulateduserid && simulateduserid != null && userId != simulateduserid) {
        headers = headers.append('simulateduserid', simulateduserid)
      }
      if (simulatedtaggerid && simulatedtaggerid != null && userId != simulatedtaggerid) {
        headers = headers.append('simulatedtaggerid', simulatedtaggerid)
      }
      const authReq = request.clone({ headers: headers });
      return next.handle(authReq).pipe(
        tap((evt: any) => {
          if (evt.body && (evt.body.message || evt.status == 200)) {
            this.commonStore.loaderEnd();
          }
        }),
        catchError((error) => {
          this.commonStore.loaderEnd();
          const ifDisableLoader = DisableNotification.some(x => request.urlWithParams.match(x));


          if (
            error.status === 401
          ) {
            if (role === ROLES.superAdmin)
              this.router.navigate(['/auth/login']);
            else if (role === ROLES.tagger)
              this.router.navigate(['/auth/tagger-login']);
            this.toastrService.error("Session Expired")
            localStorage.clear();
            sessionStorage.clear();
            this.modalService.dismissAll();
          } else {
            if (error.status === 403) {
              if (role === ROLES.admin)
                this.router.navigate(['/']);
              else if (role === ROLES.tagger)
                this.router.navigate(['/indexer']);
            } else {
              this.commonStore.notifier({ action: 'error', message: error?.message[0] });
            }
          }

          if (!ifDisableLoader && (error.status != 0 && error.status != 404 && error.status != 201 && error.status != 500)) {

            if (typeof error?.error?.message === 'string') {
              this.commonStore.notifier({
                action: 'error',
                message:
                  error.statusText == 'Forbidden'
                    ? 'Access Denied'
                    : error?.error?.message.match('User has been deleted. Please contact administrator.')
                      ? 'User has been deleted. Please contact administrator.'
                      : error.error?.message || error.message || 'Error Occured'
              });
            } else {
              this.commonStore.notifier({ action: 'error', message: error.error?.message[0] });
            }
          } else if (error.statusText == 'Unknown Error') {
            this.commonStore.notifier({ action: 'error', message: 'There is something wrong with server' });
          } else if (error.status === 403 && error.statusText == 'Forbidden') {
            localStorage.clear();
            this.router.navigate(['/auth/login']);
          }
          else {
            if (typeof error?.error?.message === 'string') {
              this.commonStore.notifier({
                action: 'error',
                message:
                  error.statusText == 'Forbidden'
                    ? 'Access Denied'
                    : error?.error?.message.match('User has been deleted. Please contact administrator.')
                      ? 'User has been deleted. Please contact administrator.'
                      : error.error?.message || error.message || 'Error Occured'
              });
            } else {
              this.commonStore.notifier({ action: 'error', message: error.error?.message[0] });
            }
          }
          throw error;
        })
      );
    }
  }
}
