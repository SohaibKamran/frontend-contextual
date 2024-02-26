import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountsService {

  userId=0
  public userClicked=new BehaviorSubject<any>(null)
  constructor() { }

  getUserId(){
    return this.userId
  }
  setUserId(id:number){
    this.userId=id
  }
}
