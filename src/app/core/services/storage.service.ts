import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  getItem = (name: string) => {
    return JSON.parse(localStorage.getItem(name))
  }
  setItem = (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value))
  }
  removeItem = (name: string) => {
    localStorage.removeItem(name)
  }
}