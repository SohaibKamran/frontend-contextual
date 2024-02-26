import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UserPermisionsService {
    constructor(private http: HttpClient) { }

    haveAccess(keyToCheck: string): boolean {
        // // console.log('key check', keyToCheck);
        let admin = JSON.parse(localStorage.getItem('admin'));
        if (admin && admin.user.role == 'admin') {
            return true;
        }
        else {

            if (admin && admin.permissions && admin.permissions.length > 0) {
                return admin.permissions.some(userRight => userRight.permission == keyToCheck);
            } else {
                // console.log("not accessable")
                return false;
            }
        }
    }

}
