import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdInventoryService {
  constructor(private apiService:ApiService) { }

  getAdvertisers(body:any){
   return this.apiService.sendRequest(requests.getAllAdvertisersForAdmin,'post',body).pipe(map((advertisers:any)=>{
    return {rows:advertisers?.data?.rows,
            count:advertisers?.data?.count}
   }))
  }
  getShowsByAdvId(body:any){
    return this.apiService.sendRequest(requests.getAllShowForAdvertiser,'post',body).pipe(map((shows:any)=>{
      return shows?.data?.rows
    }))
  }
}
