import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getRecentFavVideos, getSceneTopProducts, getSeasonsAndEpisodes, getVideoByTitle, getVideoDetailByID, getVideosadds } from 'src/app/core/constants';
// import { getRecentFavVideos, getSceneProducts, getSeasonsAndEpisodes, getVideoByTitle, getVideoDetailByID, getVideosadds } from '../core/constants';
import { ApiService } from 'src/app/core/services/api.service';
// import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private apiService: ApiService) { }

  getVideoDetailByID(body: any) {
    return this.apiService.sendRequest(getVideoDetailByID, 'post', body);
  }

  getVideoByTitle(body: any) {
    return this.apiService.sendRequest(getVideoByTitle, 'post', body);
  }

  getRecentFavVideos(body: any) {
    return this.apiService.sendRequest(
      getRecentFavVideos, 'post',
      body
    );
  }

  getVideosadds(body: any) {
    console.log('to send', body);
    return this.apiService.sendRequest(getVideosadds, 'post', body);
  }

  getSceneProducts(body: any) {
    console.log('to send', body);
    return this.apiService.sendRequest(getSceneTopProducts, 'post', body);
  }

  getSeasonsAndEpisodes(body: any) {
    return this.apiService.sendRequest(getSeasonsAndEpisodes, 'post', body);
  }
}
