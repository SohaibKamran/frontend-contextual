import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserWatchService {

  public scene= new BehaviorSubject<any>(null)
  public proxyCoorddinateId = new BehaviorSubject<any>(null)
  public videoData= new BehaviorSubject<any>(null)

  constructor() { }
}
