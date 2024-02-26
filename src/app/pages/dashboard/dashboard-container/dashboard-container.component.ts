import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import tableData from 'src/fake-data/default-data.json';
import { requests } from 'src/app/core/config/config';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexLegend
} from 'ng-apexcharts';
import { CustomsThemeService } from 'src/app/theme/shared/service/customs-theme.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  series1: ApexNonAxisChartSeries;
  chart: ApexChart;
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
import ApexCharts from 'apexcharts';


@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit{

  seriesTitle="Progress By Series"
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  userName: string;
  userCardHeight="user-series-card-height-dashboard"
  seriesCardHeight="dashboard-series"
  navigateToUserAccounts="/user-accounts"
  // public props
 @ViewChild('total_value_graph_1') total_value_graph_1: ChartComponent;
 chartOptions: Partial<ChartOptions>;
 chartOptions_1: Partial<ChartOptions>;
 chartOptions_2: Partial<ChartOptions>;
 chartOptions_3: Partial<ChartOptions>;
 chartOptions_5: Partial<ChartOptions>;
 chartOptions_6: Partial<ChartOptions>;
 chartOptions_7: Partial<ChartOptions>;
 allStats?:any
 monthChart;
 weekChart;

 preset = ['#1890FF'];
 sales_colors = ['#FFBF00', '#F27013'];
 bar_color = ['#141414', '#1890FF', '#91D5FF'];

 //constructor
 constructor(private theme: CustomsThemeService) {
  this.breadCrumbItems = [
    { label: 'Admin' },
    { label: 'Home', active: true },
  ];

   this.chartOptions = {
     chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
     colors: ['#1890ff'],
     plotOptions: { bar: { columnWidth: '80%' } },
     series: [
       {
         data: [
           220, 230, 240, 220, 225, 215, 205, 195, 185, 150, 185, 195, 80, 205, 215, 225, 240, 225, 215, 205, 80, 215, 225, 240, 215, 210,
           190
         ]
       }
     ],
     xaxis: { crosshairs: { width: 1 } },
     tooltip: {
       fixed: { enabled: false },
       x: { show: false },
       marker: { show: false }
     }
   };
   this.chartOptions_1 = {
     chart: { type: 'area', height: 100, sparkline: { enabled: true } },
     colors: ['#ff4d4f'],
     plotOptions: { bar: { columnWidth: '80%' } },
     series: [
       {
         data: [1800, 1500, 1800, 1700, 1400, 1200, 1000, 800, 600, 500, 600, 800, 500, 700, 400, 600, 500, 600]
       }
     ],
     xaxis: { crosshairs: { width: 1 } },
     tooltip: {
       fixed: { enabled: false },
       x: { show: false },
       marker: { show: false }
     }
   };
   this.chartOptions_2 = {
     chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
     colors: ['#faad14'],
     plotOptions: { bar: { columnWidth: '80%' } },
     series: [
       {
         data: [
           220, 230, 240, 220, 225, 215, 205, 195, 185, 150, 185, 195, 80, 205, 215, 225, 240, 225, 215, 205, 80, 215, 225, 240, 215, 210,
           190
         ]
       }
     ],
     xaxis: { crosshairs: { width: 1 } },
     tooltip: {
       fixed: { enabled: false },
       x: { show: false },
       marker: { show: false }
     }
   };
   this.chartOptions_3 = {
     chart: { type: 'area', height: 100, sparkline: { enabled: true } },
     colors: ['#1890ff'],
     plotOptions: { bar: { columnWidth: '80%' } },
     series: [
       {
         data: [100, 140, 100, 240, 115, 125, 90, 100, 80, 150, 160, 150, 170, 155, 150, 160, 145, 200, 140, 160]
       }
     ],
     xaxis: { crosshairs: { width: 1 } },
     stroke: {
       curve: 'straight',
       width: 1.5
     },
     tooltip: {
       fixed: { enabled: false },
       x: { show: false },
       marker: { show: false }
     }
   };
   this.chartOptions_5 = {
     chart: {
       type: 'line',
       height: 340,
       toolbar: {
         show: false
       }
     },
     colors: ['#faad14'],
     plotOptions: {
       bar: {
         columnWidth: '45%',
         borderRadius: 4
       }
     },
     stroke: {
       curve: 'smooth',
       width: 1.5
     },
     grid: {
       strokeDashArray: 4
     },
     series: [
       {
         data: [58, 90, 38, 83, 63, 75, 35, 55]
       }
     ],
     xaxis: {
       type: 'datetime',
       categories: [
         '2018-05-19T00:00:00.000Z',
         '2018-06-19T00:00:00.000Z',
         '2018-07-19T01:30:00.000Z',
         '2018-08-19T02:30:00.000Z',
         '2018-09-19T03:30:00.000Z',
         '2018-10-19T04:30:00.000Z',
         '2018-11-19T05:30:00.000Z',
         '2018-12-19T06:30:00.000Z'
       ],
       labels: {
         format: 'MMM'
       },
       axisBorder: {
         show: false
       },
       axisTicks: {
         show: false
       }
     },
     yaxis: {
       show: false
     }
   };
   this.chartOptions_6 = {
     chart: {
       type: 'bar',
       height: 430,
       toolbar: {
         show: false
       }
     },
     plotOptions: {
       bar: {
         columnWidth: '30%',
         borderRadius: 4
       }
     },
     stroke: {
       show: true,
       width: 8,
       colors: ['transparent']
     },
     dataLabels: {
       enabled: false
     },
     legend: {
       position: 'top',
       horizontalAlign: 'right',
       show: true,
       fontFamily: `'Public Sans', sans-serif`,
       offsetX: 10,
       offsetY: 10,
       labels: {
         useSeriesColors: false
       },
       markers: {
         width: 10,
         height: 10,
         radius: 50
       },
       itemMargin: {
         horizontal: 15,
         vertical: 5
       }
     },
     colors: ['#faad14', '#1890ff'],
     series: [
       {
         name: 'Net Profit',
         data: [180, 90, 135, 114, 120, 145]
       },
       {
         name: 'Revenue',
         data: [120, 45, 78, 150, 168, 99]
       }
     ],
     xaxis: {
       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
     }
   };
   this.chartOptions_7 = {
     chart: {
       type: 'bar',
       height: 250,
       stacked: true,
       toolbar: {
         show: false
       }
     },
     legend: {
       show: true,
       position: 'bottom',
       horizontalAlign: 'left',
       offsetX: 10,
       markers: {
         width: 8,
         height: 8,
         radius: 50
       }
     },
     dataLabels: {
       enabled: false
     },
     grid: {
       show: false
     },
     stroke: {
       colors: ['transparent'],
       width: 1
     },
     colors: ['#141414', '#13c2c2', '#1890ff'],
     series: [
       {
         name: 'Direct',
         data: [21, 17, 15, 13, 15, 13, 16, 13, 8, 14, 11, 9, 7, 5, 3, 3, 7]
       },
       {
         name: 'Referral',
         data: [28, 30, 20, 26, 18, 27, 22, 28, 20, 21, 15, 14, 12, 10, 8, 18, 16]
       },
       {
         name: 'Social',
         data: [50, 51, 60, 54, 53, 48, 55, 40, 44, 42, 44, 44, 42, 40, 42, 32, 16]
       }
     ],
     xaxis: {
       axisBorder: {
         show: false
       },
       axisTicks: {
         show: false
       },
       labels: {
         show: false
       }
     },
     yaxis: {
       axisBorder: {
         show: false
       },
       axisTicks: {
         show: false
       },
       labels: {
         show: false
       }
     }
   };
 }

 // life cycle event
 ngOnInit(): void {

  this.userName = localStorage.getItem('user');

   setTimeout(() => {
     this.weekChart = new ApexCharts(document.querySelector('#income-overview-tab-chart'), this.weekOptions);
    //  this.weekChart.render();
   }, 500);

   this.theme.customsTheme.subscribe((res) => {
     if (res == 'preset-1') {
       this.preset = ['#1890FF'];
       this.sales_colors = ['#FAAD14', '#1890FF'];
       this.bar_color = ['#141414', '#1890FF', '#91D5FF'];
     }
     if (res == 'preset-2') {
       this.preset = ['#3366FF'];
       this.sales_colors = ['#FFB814', '#3366FF'];
       this.bar_color = ['#141414', '#3366FF', '#ADC8FF'];
     }
     if (res == 'preset-3') {
       this.preset = ['#7265E6'];
       this.sales_colors = ['#FFBF00', '#7265E6'];
       this.bar_color = ['#141414', '#7265E6', '#B9B2F3'];
     }
     if (res == 'preset-4') {
       this.preset = ['#068e44'];
       this.sales_colors = ['#FFBF00', '#068e44'];
       this.bar_color = ['#141414', '#068e44', '#5eb57d'];
     }
     if (res == 'preset-5') {
       this.preset = ['#3c64d0'];
       this.sales_colors = ['#FFBF00', '#3c64d0'];
       this.bar_color = ['#141414', '#3c64d0', '#bed3f7'];
     }
     if (res == 'preset-6') {
       this.preset = ['#f27013'];
       this.sales_colors = ['#FFBF00', '#f27013'];
       this.bar_color = ['#141414', '#f27013', '#ffc98f'];
     }
     if (res == 'preset-7') {
       this.preset = ['#2aa1af'];
       this.sales_colors = ['#FFBF00', '#2aa1af'];
       this.bar_color = ['#141414', '#2aa1af', '#9ad6d6'];
     }
     if (res == 'preset-8') {
       this.preset = ['#00a854'];
       this.sales_colors = ['#FFBF00', '#00a854'];
       this.bar_color = ['#141414', '#00a854', '#63cf8e'];
     }
     if (res == 'preset-9') {
       this.preset = ['#004a47'];
       this.sales_colors = ['#FFBF00', '#004a47'];
       this.bar_color = ['#141414', '#004a47', '#5bbda9'];
     }
   });
 }


 onChangeChart(changeEvent: NgbNavChangeEvent) {
   if (changeEvent.nextId === 1) {
     setTimeout(() => {
       this.weekChart = new ApexCharts(document.querySelector('#income-overview-tab-chart'), this.weekOptions);
       this.weekChart.render();
     }, 200);
   }

   if (changeEvent.nextId === 2) {
     setTimeout(() => {
       this.monthChart = new ApexCharts(document.querySelector('#income-overview-tab-chart-1'), this.monthOptions);
       this.monthChart.render();
     }, 200);
   }
 }

 monthOptions = {
   chart: {
     type: 'area',
     height: 355,
     toolbar: {
       show: false
     }
   },
   colors: ['#1890ff'],
   fill: {
     type: 'gradient',
     gradient: {
       shadeIntensity: 1,
       type: 'vertical',
       inverseColors: false,
       opacityFrom: 0.5,
       opacityTo: 0
     }
   },
   dataLabels: {
     enabled: false
   },
   stroke: {
     curve: 'straight',
     width: 1
   },
   plotOptions: {
     bar: {
       columnWidth: '45%',
       borderRadius: 4
     }
   },
   grid: {
     strokeDashArray: 4
   },
   series: [
     {
       data: [100, 40, 60, 40, 40, 40, 80, 40, 40, 50, 40, 40]
     }
   ],
   xaxis: {
     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     axisBorder: {
       show: false
     },
     axisTicks: {
       show: false
     }
   }
 };

 weekOptions = {
   chart: {
     type: 'area',
     height: 355,
     toolbar: {
       show: false
     }
   },
   colors: ['#1890ff'],
   fill: {
     type: 'gradient',
     gradient: {
       shadeIntensity: 1,
       type: 'vertical',
       inverseColors: false,
       opacityFrom: 0.5,
       opacityTo: 0
     }
   },
   dataLabels: {
     enabled: false
   },
   stroke: {
     curve: 'straight',
     width: 1
   },
   plotOptions: {
     bar: {
       columnWidth: '45%',
       borderRadius: 4
     }
   },
   grid: {
     strokeDashArray: 4
   },
   series: [
     {
       data: [100, 20, 60, 20, 20, 80, 20]
     }
   ],
   xaxis: {
     categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
     axisBorder: {
       show: false
     },
     axisTicks: {
       show: false
     }
   }
 };

 page_view = [
   {
     title: 'Admin Home',
     link: '/demo/admin/index.html',
     amount: '7755',
     percentage: '31.74%'
   },
   {
     title: 'Form Elements',
     link: '/demo/admin/forms.html',
     amount: '5215',
     percentage: '28.53%'
   },
   {
     title: 'Utilities',
     link: '/demo/admin/util.html',
     amount: '4848',
     percentage: '25.74%'
   },
   {
     title: 'Form Validation',
     link: '/demo/admin/validation.html',
     amount: '3275',
     percentage: '23.17%'
   },
   {
     title: 'Modals',
     link: '/demo/admin/modals.html',
     amount: '3003',
     percentage: '22.21%'
   }
 ];

 transaction = [
   {
     background: 'text-success bg-light-success',
     icon: 'ti ti-gift',
     title: 'Order #002434',
     time: 'Today, 2:00 AM',
     amount: '+ $1,430',
     percentage: '78%'
   },
   {
     background: 'text-primary bg-light-primary',
     icon: 'ti ti-message-circle',
     title: 'Order #984947',
     time: '5 August, 1:45 PM',
     amount: '- $302',
     percentage: '8%'
   },
   {
     background: 'text-danger bg-light-danger',
     icon: 'ti ti-settings',
     title: 'Order #988784',
     time: '7 hours ago',
     amount: '- $682',
     percentage: '16%'
   }
 ];

 tables = tableData;

 last_section = [
   {
     title: 'Published Project',
     color: 'progress-primary',
     value: '30',
     percentage: '30%'
   },
   {
     title: 'Completed Task',
     color: 'progress-success',
     value: '90',
     percentage: '90%'
   },
   {
     title: 'Pending Task',
     color: 'progress-danger',
     value: '50',
     percentage: '50%'
   },
   {
     title: 'Issues',
     color: 'progress-warning',
     value: '55',
     percentage: '55%'
   }
 ];

 channels = [
   {
     title: 'Top Channels',
     icon: 'ti ti-device-analytics',
     background: 'text-secondary bg-light-secondary',
     time: 'Today, 2:00 AM',
     amount: '+ $1,430',
     percentage: '35%'
   },
   {
     title: 'Top Pages',
     icon: 'ti ti-file-text',
     background: 'text-primary bg-light-primary',
     time: 'Today, 6:00 AM',
     amount: '- $1430',
     percentage: '35%'
   }
 ];
}
