import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private authfackservice: AuthfakeauthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        // const currentUser = this.authfackservice.currentUserValue;
        const user = localStorage.getItem('token')
        // console.log(user)
        if (user) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user}`,
                },
            });
        }

        return next.handle(request);
    }
}
