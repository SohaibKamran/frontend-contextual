import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterBody:any
  screen:string
  submitted:boolean=false
  constructor() { }

  setFilterBody(body:any,screen:string){
  this.filterBody=body
  this.screen=screen
  }

  getFilterBody(screen:string){
    if(screen!=this.screen || screen=='Database'){
      return null
    }
    else{
      return this.filterBody
    }
  }
}
