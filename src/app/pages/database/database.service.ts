import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  nameSearch = new BehaviorSubject<any>(null)
  sortBy = new BehaviorSubject<any>(null)
  databaseRecords = new BehaviorSubject<any>({
    pageNo: 1,
    limit: 100
  })
  databaseProgress = new BehaviorSubject<any>(null)
  databaseCount = new BehaviorSubject<any>(null)
  constructor() { }
}
