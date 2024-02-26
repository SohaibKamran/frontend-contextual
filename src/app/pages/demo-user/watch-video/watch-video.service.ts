import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchVideoService {
  public videoID  = new BehaviorSubject<any>(null);
  constructor() { }
}
