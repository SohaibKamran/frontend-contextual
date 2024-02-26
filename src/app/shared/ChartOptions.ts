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
    states:ApexStates
  };
