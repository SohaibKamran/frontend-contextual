import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filters=["Last Week", "Last Month", "Last Year"]

  constructor() { }

  setMinDate(filter:string){

    let minDate:string
    let date = new Date()
    filter = filter.toLowerCase()
    if(filter.includes('month')){
      date.setDate(date.getDate() - 30)
      minDate = date.toISOString().replace('T', ' ').split('.')[0];
    }
    if(filter.includes('week')){
      date.setDate(date.getDate() - 7)
      minDate = date.toISOString().replace('T', ' ').split('.')[0];
    }
    if(filter.includes('year')){

      let pastYear = date.getFullYear()-1
      date.setFullYear(pastYear)
      minDate = date.toISOString().replace('T', ' ').split('.')[0];
      // console.log(minDate)
    }
    if(filter.includes('day')){
      date.setDate(date.getDate()-1)
      minDate = date.toISOString().replace('T', ' ').split('.')[0];
    }

    return minDate
  }

  getFilterNames(){

    return this.filters
  }

  getGranularity(granularity:string){

    granularity = granularity.toLowerCase()
    if (granularity.includes("month")){

      return "DAILY"
    }
    else if (granularity.includes("week")){

      return "DAILY"
    }
    else {

      return "MONTHLY"
    }

  }
  
}
