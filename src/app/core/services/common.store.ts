import { Injectable } from '@angular/core';
// import { UserModel } from '../shared/models/user';
// import { observable, action, computed, autorun} from 'mobx';
import { SnakbarModel } from './../models/snakbar.model'
// import { cloneDeep } from 'lodash';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class CommonStore {
    loader: boolean = false;
    //   @observable userModisOpenel: UserModel;
    globalAlert: SnakbarModel;
    // alertArray: Array<SnakbarModel> = [{message:'testing alert',case:'error',isOpen:true}];
    alertArray: Array<SnakbarModel> = [];
    redirectUrl: any;
    constructor() {
        if (window.localStorage['redirectUrl']) {
            let redUrl = JSON.parse(localStorage["redirectUrl"]);
            this.redirectUrl = Object.assign({}, redUrl);
        }

    }

    loaderStart() {
        if (this.loader == true) {
            this.loader = false;
        }
        setTimeout(() => {
            this.loader = true;
        }, 1000);
    }
    get loaderState() {
        return this.loader;
    }

    loaderEnd() {
        setTimeout(() => {
            if (this.loader)
                this.loader = false;
        }, 1000);
    }

    notifier(notification) {
        this.globalAlert = new SnakbarModel();
        this.globalAlert.id = Math.random().toString();
        this.globalAlert.isOpen = true;
        this.globalAlert.message = notification.message;
        this.globalAlert.case = notification.action;
        this.globalAlert.local = notification.local ? notification.local : false;
        this.alertArray.push(this.globalAlert);
        setTimeout(() => {
            if (this.alertArray && this.alertArray.length > 0) {
                this.alertArray.splice(0, 1)
            }
        }, 5000);
    }
    closeNotifier(alert) {
        let index = this.alertArray.findIndex(x => x.id == alert.id);
        if (index > -1) {
            this.alertArray.splice(index, 1);
        }
    }



    clearStore() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.redirectUrl = null;
        $('.modal').modal('hide');
    }
    resetRedirectUrl() {
        this.redirectUrl = null;
        window.localStorage.removeItem('redirectUrl');
    }
    setRedirectUrl(url: any) {
        this.redirectUrl = url;
        window.localStorage.setItem('redirectUrl', JSON.stringify(this.redirectUrl));

    }

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
