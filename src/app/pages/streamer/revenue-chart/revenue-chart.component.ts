import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { FilterService } from '../../dashboard/services/filter.service.';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series1: ApexNonAxisChartSeries;
  chart: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  colors: string[];
  labels: string[];
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
  theme: ApexTheme;
};

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})


export class RevenueChartComponent implements OnInit {

  area_colors = ['#FFAA00', '#E6F7FF'];
  revenueChart: Partial<ChartOptions>
  interval: any = {}
  filters = ["All Time", "Month", "Week"]
  streamerRevenue: any = []
  dates: any = [];
  loader = true;
  selectedFilter = 'Week';

  constructor(private apiService: ApiService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.filterData("Week")
  }
  fetchData() {
    this.apiService.sendRequest(requests.getStreamerRevenue, 'post', this.interval).subscribe((res: any) => {
      for (let i = 0; i < res?.data?.revenueStats?.length; i++) {
        this.streamerRevenue[i] = res.data.revenueStats[i]?.revenue
        this.dates[i] = res.data.revenueStats[i]?.date
      }
      this.createChart()
      this.streamerRevenue = []
      this.dates = []
    })
  }
  createChart() {
    this.revenueChart = {
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
          data: this.streamerRevenue
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
    this.fetchData()
  }
}
