import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageAnnotatorsService {

  private annotatorId:number=0
  constructor() { }
  setAnnotatorId(id:number){
    this.annotatorId=id
  }
  getAnnotatorId(){
    return this.annotatorId
  }
}
