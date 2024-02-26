import { Injectable } from '@angular/core';
import { classicVideos, recentFavouriteVideos, trendingVideos } from 'src/app/core/constants';
// import { classicVideos, recentFavouriteVideos, trendingVideos } from '../core/constants';
import { ApiService } from 'src/app/core/services/api.service';
// import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private apiService: ApiService) { }
  getRecentFavoriteVideos = (params: { limit: number, pageNo: number, onlyActive?: boolean }) => {
    return this.apiService.sendRequest(recentFavouriteVideos, 'post', params)
  }
  getTrendingVideos = (params: { limit: number, pageNo: number, onlyActive?: boolean, onlyBrokenScene?:boolean }) => {
    return this.apiService.sendRequest(trendingVideos, 'post', params)
  }
  getClassicVideos = (params: { limit: number, pageNo: number, onlyActive?: boolean }) => {
    return this.apiService.sendRequest(classicVideos, 'post', params)
  }
}
