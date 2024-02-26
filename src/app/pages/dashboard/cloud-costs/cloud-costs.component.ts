import { Component, OnInit } from '@angular/core';
import { ChartOptions } from '../dashboard-container/dashboard-container.component';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Subject } from 'rxjs';
import { FilterService } from '../services/filter.service.';
@Component({
  selector: 'app-cloud-costs',
  templateUrl: './cloud-costs.component.html',
  styleUrls: ['./cloud-costs.component.scss']
})
export class CloudCostsComponent implements OnInit {

  area_colors = ['#0050B3', '#1890FF', 'yellow'];
  cloudCostChart: Partial<ChartOptions>
  costs: any = []
  dates: any = []
  interval: any = {
    Granularity: "",
    StartDate: "",
    EndDate: ""
  }

  filters: string[]
  filterName= "Last Week"
  constructor(private apiService: ApiService, private filterService: FilterService) { }
  ngOnInit(): void {
    this.filters = this.filterService.getFilterNames()
    this.filterData(this.filterName)
  }

  createChart() {

    this.cloudCostChart = {
      chart: {
        height: '300px',
        type: 'line',
        toolbar: {

          show: false
        }
      },
      legend: {

        position: 'top',
        horizontalAlign:'center',

        
      },
      dataLabels: {
        enabled: false,
        
        
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: this.costs,

      xaxis: {
        categories: this.dates
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
        y: {
          formatter: function (value) {
            return "$" + value; // Adding the dollar sign to the value
          }
        }
      }
    };
  }

  filterData(interval: string) {
    this.filterName=interval
    const date = new Date()
    this.interval.StartDate = this.filterService.setMinDate(interval).split(' ')[0]
    if (this.interval.StartDate) {
      
      this.interval.EndDate = date.toISOString().replace('T', ' ').split('.')[0].split(' ')[0];
      // console.log(this.interval.StartDate)
    }
    else {
      this.interval = {}
    }
    // console.log(this.interval)
    this.interval.Granularity=this.filterService.getGranularity(interval)
    this.fetchData()
  }
  fetchData() {
    this.apiService.sendRequest(requests.getCloudCosts, 'post', this.interval).subscribe
      ((res: any) => {
        // console.log(res)
        let length = res.data.awsCost.ResultsByTime.length
        // console.log(length)
        let tempArrNames = []
        let tempArrDates = []
        this.costs=[]
        this.dates=[]

        for (let i = 0; i < length; i++) {
          
          let group = res.data.awsCost.ResultsByTime[i].Groups
          let timePeriod = res.data.awsCost.ResultsByTime[i].TimePeriod
          for (let j = 0; j < group.length; j++) {

            // console.log(group.length)
            if (!tempArrNames.find(element =>
              element == group[j].Keys[0]
            )) {

              // console.log(group[j].Keys[0], j)
              
              tempArrNames.push(group[j].Keys[0])
              
              this.costs.push({

                name: group[j].Keys[0],
                data: []
              })
              
            }
            // console.log(tempArrNames, "Temp Array Names")
           // // console.log(this.costs[j], j)
            this.costs[j]?.data.push(parseInt(group[j].Metrics.UnblendedCost.Amount.toLocaleString("en-US")))
            if(this.costs[j]?.name.toLowerCase().includes('dev')){
              this.costs[j].name='AWS Dev'
            }
            else if(this.costs[j]?.name.toLowerCase().includes('prod')){
              this.costs[j].name='AWS Prod'
            }
            //this.costs[j].name=this.costs[j]?.name.replace('$',' ')
            // console.log(parseFloat(group[j].Metrics.UnblendedCost.Amount))

            if (!tempArrDates.find(element =>
              element == timePeriod.Start)) {

              this.dates.push(timePeriod.Start)
              tempArrDates.push(timePeriod.Start)

            }
            this.createChart()
          }
        }
        const gcp = res?.data?.gcpCost.reverse()
        console.log(gcp)
        this.costs.push({
          name:"GCP",
          data:gcp.map(item=>parseInt(item.f0_))
        })

        // this.costs[2].data=this.costs[2].data.slice(0,7)

         console.log(this.costs)
        // console.log(this.dates)
      }
      )

  }

}
