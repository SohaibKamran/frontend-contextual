import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
public videoData  = new BehaviorSubject<any>(null);
public sceneId = new BehaviorSubject<any>(null);
public taggerId = new BehaviorSubject<any>(null);

  constructor() { 
    // console.log("asd")
  }
}
