import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { FilterService } from '../services/filter.service.';
import { ChartOptions } from '../dashboard-container/dashboard-container.component';
@Component({
  selector: 'app-average-vzot-score',
  templateUrl: './average-vzot-score.component.html',
  styleUrls: ['./average-vzot-score.component.scss']
})
export class AverageVzotScoreComponent implements OnInit {

  area_colors = ['#FFAA00', '#E6F7FF'];
  averageVzotScoreChart: Partial<ChartOptions>
  interval: any = {}
  filters = ["All Time", "Month", "Week"]
  avgVZoTScore: any = []
  dates: any = [];
  loader = true;
  selectedFilter = 'Week';

  constructor(private apiService: ApiService, private filterService: FilterService) { }

  ngOnInit(): void {


    this.filterData("Week")
    // this.fetchData()


  }
  fetchData() {


    this.apiService.sendRequest(requests.getAvgVzot, 'post', this.interval).subscribe((res: any) => {
      // console.log(this.interval)
      for (let i = 0; i < res?.data?.length; i++) {
        this.avgVZoTScore[i] = res.data[i].avgVzotScore
        this.dates[i] = res.data[i].date
      }
      console.log(this.dates)
      this.createChart()
      // console.log(this.avgVZoTScore)
      this.avgVZoTScore = []
      this.dates = []
    })
  }
  createChart() {

    this.averageVzotScoreChart = {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [
        {
          name: 'Average VZoT',
          data: this.avgVZoTScore
        },

      ],


      xaxis: {
        type: 'category',
        categories: this.dates
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }

    };
  }

  filterData(interval: string) {
    this.selectedFilter = interval;

    const date = new Date()
    this.interval.minDate = this.filterService.setMinDate(interval)

    if (this.interval.minDate) {
      this.interval.maxDate = date.toISOString().replace('T', ' ').split('.')[0]
    }
    else {

      this.interval = {}
    }

    // console.log(this.interval)

    this.fetchData()
  }
}
