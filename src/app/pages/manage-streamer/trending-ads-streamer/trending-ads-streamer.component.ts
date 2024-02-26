import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trending-ads-streamer',
  templateUrl: './trending-ads-streamer.component.html',
  styleUrls: ['./trending-ads-streamer.component.scss']
})
export class TrendingAdsStreamerComponent {
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  activeUsers: any
  totalImpressions: number
  trendingAds: any

  constructor(public apiService: ApiService, private router:Router) { }

  ngOnInit(): void {
    this.fetchTrendingAds();
  }

  fetchTrendingAds(){
    this.apiService.sendRequest(requests.getTrendingAds, 'post', this.pagination)
    .subscribe((res: any) => {
      this.trendingAds = res?.data?.rows
    })
  }
  routeToDatabase(){

    this.router.navigate(['/database'])
  }
}
