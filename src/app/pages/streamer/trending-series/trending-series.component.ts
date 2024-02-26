import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-trending-series',
  templateUrl: './trending-series.component.html',
  styleUrls: ['./trending-series.component.scss']
})
export class TrendingSeriesComponent implements OnInit{
  trendingShows=[];
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.apiService.sendRequest(requests.streamerPopularShows, 'post', {key:"Top Stats"}).subscribe((res: any) => {
      this.trendingShows = res.data.popularShows;
    })
  }
}
