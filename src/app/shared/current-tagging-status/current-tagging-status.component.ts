import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ChartOptions } from '../ChartOptions';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DatabaseService } from 'src/app/pages/database/database.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-current-tagging-status',
  templateUrl: './current-tagging-status.component.html',
  styleUrls: ['./current-tagging-status.component.scss'],
  imports: [CommonModule, NgApexchartsModule]
})
export class CurrentTaggingStatusComponent implements OnInit {
  currentTaggingStatusChart: Partial<ChartOptions>;
  pie_color = ['#CDCDCD', '#096DD9', '#FAAD14', '#FF4D4F', '#52C41A'];
  stats = {} as any
  series = []
  datalabels = []
  constructor(private apiService: ApiService, private databaseService: DatabaseService, private router: Router) { }
  ngOnInit() {
    this.fetchData()
  }
  fetchData() {
    this.apiService.sendRequest(requests.getAllStats, 'post', {
      "slug": ["tagging_status"]
    }).subscribe((res: any) => {
      this.series = Object.values(res.data[0].value)
      this.datalabels = Object.keys(res.data[0].value);
      let arr = []
      let arr2 = []

      arr.push(this.datalabels[0], this.datalabels[4], this.datalabels[3], this.datalabels[2], this.datalabels[1])
      this.datalabels = arr
      arr2.push(this.series[0], this.series[4], this.series[3], this.series[2], this.series[1])
      this.series = arr2
      // arr.push(this.datalabels[])

      console.log(this.datalabels)
      // for (let i = 0; i < this.series.length; i++) {

      //   this.datalabels[i] = this.datalabels[i] + ' ' + `<small class='text-muted'>${this.series[i]}</small>`
      // }
      // console.log(this.series)
      this.createChart()

    })
  }
  routeToDatabase(index: number) {
    console.log(index)
    const body = {
      sceneStatusId: index + 1,
      pageNo: 1,
      limit: 10
    }
    this.databaseService.databaseRecords.next(body)
    this.router.navigate(['/database/filtered'])
  }

  ngOnDestroy(): void {

  }



  createChart() {
    this.currentTaggingStatusChart = {
      chart: {
        width: '100%',
        height: '250',
        type: 'pie',
        events: {
          legendClick: (chartContext, seriesIndex, config) => {
            this.routeToDatabase(seriesIndex)
          }
        }
      },


      labels: this.datalabels,

      series1: [this.series[0], this.series[1], this.series[2], this.series[3], this.series[4]],

      legend: {

        position: 'right',
        labels: {
          useSeriesColors: true
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true
        }
      },
      states: {

        hover: {

          filter: {
            type: 'none'
          }
        }
      }

    };
  }


}
