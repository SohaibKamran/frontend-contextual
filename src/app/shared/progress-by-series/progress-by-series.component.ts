import { Component, Input, OnInit } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
@Component({
  standalone: true,
  selector: 'app-progress-by-series',
  templateUrl: './progress-by-series.component.html',
  imports: [CommonModule, NgbProgressbarModule, CoreModule],
  styleUrls: ['./progress-by-series.component.scss'],


})
export class ProgressBySeriesComponent implements OnInit {
  @Input() title: string
  @Input() cardHeight: string
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  body: any
  series = []
  totalSeries = 0
  count=0
  constructor(private apiService: ApiService, private router: Router) {

  }
  ngOnInit(): void {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this._fetchSeries();
  }
  last_section = [
    {
      title: 'Queens Gambit',
      color: 'progress-primary',
      value: 30,
      percentage: '30%'
    },
    {
      title: 'Love Island',
      color: 'progress-success',
      value: 90,
      percentage: '90%'
    },
    {
      title: 'Outer Bank',
      color: 'progress-danger',
      value: 50,
      percentage: '50%'
    },
    {
      title: 'Blackish',
      color: 'progress-warning',
      value: 55,
      percentage: '55%'
    },
    {
      title: 'Ted Lesso',
      color: 'progress-primary',
      value: 30,
      percentage: '30%'
    },
    {
      title: 'The Morning Show',
      color: 'progress-success',
      value: 90,
      percentage: '90%'
    },

    {
      title: 'Queens Gambit',
      color: 'progress-primary',
      value: 30,
      percentage: '30%'
    },
    {
      title: 'Love Island',
      color: 'progress-success',
      value: 90,
      percentage: '90%'
    },
    {
      title: 'Outer Bank',
      color: 'progress-danger',
      value: 50,
      percentage: '50%'
    },
    {
      title: 'Blackish',
      color: 'progress-warning',
      value: 55,
      percentage: '55%'
    },
    {
      title: 'Ted Lesso',
      color: 'progress-primary',
      value: 30,
      percentage: '30%'
    },
    {
      title: 'The Morning Show',
      color: 'progress-success',
      value: 90,
      percentage: '90%'
    },

  ];

  _fetchSeries() {
    if(this.totalSeries!=this.count || this.count==0){
      this.apiService.sendRequest(requests.getProgresSeries, 'post', this.body).subscribe((res: any) => {
        console.log(res)
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.series[this.totalSeries] = res?.data?.rows[i]
          this.totalSeries++
        }
        this.count=res?.data?.count
        console.log(this.series)
      })
    } 
  }
  routeToVideoCatalog(series: any = null) {
    if (series) {
      this.apiService.sendRequest(requests.getProgresSeries, 'post', this.body).subscribe((res: any) => {
        series.pageNo = res?.data?.pageNoOfSeries
        series.count=res?.data?.count
        this.router.navigate(['/videos'])
        console.log(res)
        sessionStorage.setItem('series', JSON.stringify(series))
      })
    }
    else{
      this.router.navigate(['/videos'])
    }
  }
  setSeriesFilter(series: any) {
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
      this._fetchSeries()
    }
  }
}
