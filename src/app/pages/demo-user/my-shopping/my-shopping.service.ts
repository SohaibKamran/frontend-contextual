import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Injectable({
  providedIn: 'root'
})
export class MyShoppingService {

  public selectedTab  = new BehaviorSubject<any>(1);

  constructor(private apiService: ApiService) { }

  getTopProducts = (body: any) => {
    return this.apiService.sendRequest(requests.getTrending, 'post', body)
  }

  getTopProductsByShow = (body: any) => {
    return this.apiService.sendRequest(requests.getTopProductsByShow, 'post', body)

  }
  getTopProductsByBrand = (body: any) => {
    return this.apiService.sendRequest(requests.getTopProductsByBrand, 'post', body)
  }

  getTopProductsByActor = (body: any) => {
    return this.apiService.sendRequest(requests.getTopProductsByActor, 'post', body)
  }
}
