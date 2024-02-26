import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MyShoppingService } from 'src/app/pages/demo-user/my-shopping/my-shopping.service';

@Component({
  standalone: true,
  imports: [CommonModule, CoreModule],
  selector: 'app-trending-shows',
  templateUrl: './trending-shows.component.html',
  styleUrls: ['./trending-shows.component.scss'],

})
export class TrendingShowsComponent implements OnInit {

  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  trendingShows = [];
  body: any
  totalSeries = 0
  count = 0
  @Input() screen: string
  constructor(private apiService: ApiService, private router: Router, private shoppingService: MyShoppingService) { }
  ngOnInit(): void {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      onlyActive: true
    }
    this.fetchData()
  }
  fetchData() {
    if (this.totalSeries != this.count || this.count == 0) {
      this.apiService.sendRequest(requests.getTrendingShows, 'post', this.body).subscribe((res: any) => {
        console.log(res)
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.trendingShows[this.totalSeries] = res?.data?.rows[i]
          this.totalSeries++
        }
        this.count = res?.data?.count
        // console.log(this.series)
      })
    }
  }
  routeToVideoCatalog(series: any = null) {
    if (this.screen != 'My Shopping') {
      if (series) {
        this.apiService.sendRequest(requests.getTrendingShows, 'post', this.body).subscribe((res: any) => {
          series.pageNo = res?.data?.pageNoOfSeries
          series.count = res?.data?.countOfSeries
          console.log(res)
          sessionStorage.setItem('series', JSON.stringify(series))
          this.router.navigate(['/videos'])
        })
      }
      else {
        this.router.navigate(['/videos'])
      }
    }
    else {

      if (series) {
        if (series.videoTypeId == 1)
          sessionStorage.setItem('series', JSON.stringify(series))
        else
          sessionStorage.setItem('show', JSON.stringify(series))
      }
      else {
        console.log("Redirect to shows")
      }
      this.shoppingService.selectedTab.next(3)
    }
  }
  setSeriesFilter(series: any) {
    console.log("series", series)
    this.body = {
      ...this.body,
      clickedOnSeriesId: series.id,
      limitOfSeriesListing: this.pagination.limit
    }
    this.routeToVideoCatalog(series)
  }


  onScrollEnd(e) {
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++
      this.body = {
        ...this.body, pageNo: this.pagination.pageNo
      }
      this.fetchData()
    }

  }
}