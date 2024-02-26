import { Injectable } from '@angular/core';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/api.service';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EpisodeAdService {

  constructor(private apiService:ApiService) { }

  getCoordinateListingForAdInventory(body:any){
    return this.apiService.sendRequest(requests.getCoordinateListingForAdInventory,'post',body).pipe(map((res:any)=>{
      return res?.data?.rows
    }))
  }
  getAllSeries(){
    return this.apiService.sendRequest(requests.getSeriesName,'post').pipe(map((res:any)=>{
      return res?.data
    }))
  }
  getAllSeasons(body:any){
    return this.apiService.sendRequest(requests.getAllSeasonofSeries,'post',body).pipe(map((res:any)=>{
      return Object.keys(res?.data).map(val => res?.data[val]);
    }))
  }
}
